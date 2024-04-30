import pytesseract
from PIL import Image

image_path = 'D:\Bill-Analyzer-and-Expense-Tracker-22IT086-22IT105-22IT110\Python\hotel.png'
image = Image.open(image_path)

text = pytesseract.image_to_string(image)

print(text)