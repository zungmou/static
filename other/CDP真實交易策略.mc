input:stoploss(0.005);
variables:cdp(0),ah(0),nh(0),nl(0),al(0),longcount(0),shortcount(0);

if time = 0850 then
begin
    // cdp (central daily pivot) 即中枢日线转折点
    // 计算 cdp 的值：（昨高+昨低+昨收*2）÷4
    cdp = (highD(1)+lowD(1)+2*closeD(1))/4;

    // ah (average high) 即平均最高价格
    // 计算 ah 的值：cdp＋（昨高－昨低）
    // 解释：昨高－昨低是昨日的波动幅度，cdp＋（昨高－昨低）是昨日的平均价格加上昨日的波动幅度，就是今日的平均最高价格。
    ah = cdp + (highD(1)-lowD(1));

    // nh (normal high) 即普通最高价格
    // 计算 nh 的值：cdp×2－昨低
    // 解释：俩份的昨日平均价格减去昨日的最低价格，就是今日的最高价格。
    nh = cdp*2 - lowD(1);

    // nl (normal low) 即普通最低价格
    // 计算 nl 的值：cdp×2－昨高
    // 解释：俩份的昨日平均价格减去昨日的最高价格，就是今日的最低价格。
    nl = cdp*2 - highD(1);

    // al (average low) 即平均最低价格
    // 计算 al 的值：cdp－（昨高－昨低）
    // 解释：昨高－昨低是昨日的波动幅度，cdp－（昨高－昨低）是昨日的平均价格减去昨日的波动幅度，就是今日的平均最低价格。
    al = cdp - (highD(1)-lowD(1));

    // 初始化 longcount 和 shortcount
    longcount = 0;
    shortcount = 0;
end;

// 交易规则
// 1. 早盘 8:45 到 13:00 之间，如果 cdp 是有效价格，挂 ah 多头突破单。
if (marketposition = -1 or marketposition = 0) and time > 0845 and time < 1300 and cdp > 0 and longcount = 0 then begin
    buy("CDP_B") 1 contract next bar at ah stop;
end;

// 2. 早盘 8:45 到 13:00 之间，如果 cdp 是有效价格，挂 al 空头突破单。
if (marketposition = 1 or marketposition = 0) and time > 0845 and time < 1300 and cdp > 0 and shortcount = 0 then begin
    sellshort("CDP_S") 1 contract next bar at al stop;
end;

// 3. 如果当前持仓是多单，那么设置 longcount 为 1，表示已经做过多单了。
if marketposition = 1 then begin
    longcount = 1;
end;

// 4. 如果当前持仓是空单，那么设置 shortcount 为 1，表示已经做过空单了。
if marketposition = -1 then begin
    shortcount = 1;
end;

// 5. 如果当前持仓是多单，挂 nh 多头止盈单。
if marketposition = 1 then exitlong("TakeLong") at nh stop;

// 6. 如果当前持仓是空单，挂 nl 空头止盈单。
if marketposition = -1 then exitshort("TakeShort") at nl stop;

// 7. 如果当前持仓是多单，挂多头固定点位止损单。
if marketposition = 1 then begin
    exitlong("StopLong") 1 contract next bar at entryprice * (1 - stoploss);
end;

// 8. 如果当前持仓是空单，挂空头固定点位止损单。
if marketposition = -1 then begin
    exitshort("StopShort") 1 contract next bar at entryprice * (1 + stoploss);
end;

// 9. 如果时间是 13:40，那么平仓所有持仓。
if time = 1340 then begin
    exitlong("exitL");
    exitshort("exitS");
    cdp = 0;
    ah = 0;
    nh = 0;
    nl = 0;
    al = 0;
end;
