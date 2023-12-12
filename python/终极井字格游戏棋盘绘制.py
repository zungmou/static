"""
绘制一个终极版 9*9 井字棋棋盘
"""

from PIL import Image, ImageDraw

a4_width = 2480  
a4_height = 3508  
canvas = Image.new('RGB', (a4_width, a4_height), 'white')
draw = ImageDraw.Draw(canvas)

big_square_size = a4_width / 3.5
small_square_size = big_square_size // 3

# 计算大格子的水平和垂直偏移量以使其居中
big_square_x_offset = (a4_width - 3 * big_square_size) // 2
big_square_y_offset = (a4_height - 3 * big_square_size) // 2

# 画大格子
for row in range(3):
    for col in range(3):
        x1 = col * big_square_size+ big_square_x_offset
        y1 = row * big_square_size+ big_square_y_offset
        x2 = x1 + big_square_size
        y2 = y1 + big_square_size
        draw.rectangle([x1, y1, x2, y2], outline='black', width=10)

# 画小格子
for row in range(9):
    for col in range(9):
        x1 = col * (small_square_size + 0) + (col // 3) * 1  + big_square_x_offset
        y1 = row * (small_square_size + 0) + (row // 3) * 1  + big_square_y_offset
        x2 = x1 + small_square_size
        y2 = y1 + small_square_size
        draw.rectangle([x1, y1, x2, y2], outline='black', width=2)

canvas.save('Ultimate-Tic-Tac-Toe_board.png')

