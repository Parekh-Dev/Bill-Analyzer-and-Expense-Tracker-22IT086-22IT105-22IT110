import pytesseract
from PIL import Image

image_path = 'C:\\Users\Shiv\Desktop\Study\Expense-Tracker\stationery.png'
image = Image.open(image_path)

text = pytesseract.image_to_string(image)

print(text)