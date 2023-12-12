inputs: X(70); 
vars: alpha(0), 
bo(0), 
bo1(c), 
xest(0), 
xest1(c), 
ema(0), 
ema1(c), 
tosc(0); 

alpha = 2 / (X + 1); ------>策略平滑因子 
bo = (1 - alpha) * bo1 + close; 
ema = ema1 + alpha * (close - ema1); 
xest = (1 - alpha) * xest1 + alpha * (close + bo - bo1); 
bo1 = bo; 
xest1 = xest; 
ema1 = ema; 
tosc = xest - ema; 

if barnumber > 50 then begin 
	if tosc > 0 then buy this bar on close; 
	if tosc < 0 then sellshort this bar on close; 
end;
