                                    # Sudoku Solver (Desktop Program)

# Modules
from tkinter import *

# Create and customize popup window
window = Tk()
window.title("Sudoku Solver")
window.geometry("500x700")
window.configure(bg = "#3a3845")
window.resizable(False, False)

# Create and customize canvas
my_canvas = Canvas(window, bg = "slategrey", height = 500, width = 500, highlightbackground = "black", highlightthickness= 3)
my_canvas.pack()

start_button = Button(window, text = "Quit", command= window.quit)
start_button.pack(pady = 12)

# Calculations

canvas_width = 500
canvas_height = 500

horizontal_lines = canvas_height / 9
vertical_lines = canvas_width / 9

# Draw vertical lines
for i in range(10):
    x = i * vertical_lines
    line_width = 3 if i % 3 == 0 else 1
    my_canvas.create_line(x, 0, x, canvas_height, fill="black", width=line_width)

# Draw horizontal lines
for i in range(10):
    y = i * horizontal_lines
    line_width = 3 if i % 3 == 0 else 1
    my_canvas.create_line(0, y, canvas_width, y, fill="black", width=line_width)


# Loop program to keep it running
window.mainloop()
