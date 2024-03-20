import pytesseract
from PIL import Image
import re

# Open the image
image_path = 'C:\\Users\Shiv\Desktop\Study\Expense-Tracker\sample_invoice.png'
image = Image.open(image_path)

# Use pytesseract to extract text from the image
extracted_text = pytesseract.image_to_string(image)

#For Total
# Define a regular expression pattern to match the total amount
total_amount_pattern = r'TOTAL:\s*(\d+)'

# Search for the total amount pattern in the extracted text
total_amount_match = re.search(total_amount_pattern, extracted_text, re.IGNORECASE)

# If a match is found, extract the total amount
if total_amount_match:
    total_amount = total_amount_match.group(1)
    # Remove commas from the total amount and convert it to a float
    total_amount = float(total_amount.replace(',', ''))
    print("Total Amount: ₹", total_amount)
else:
    print("Total amount not found in the invoice.")


#For Name
# Define a regular expression pattern to match the text below "Bill To"
bill_to_pattern = r'BILLED TO:\s*(.+)'

# Search for the "Bill To" pattern in the extracted text
bill_to_match = re.search(bill_to_pattern, extracted_text)

# If a match is found, extract the text below "Bill To"
if bill_to_match:
    data_below_bill_to = bill_to_match.group(1).strip()
    print("Name of the Owner:", data_below_bill_to)
else:
    print("Cannot found Name of the Owner")


#For Date
date_pattern = r'DATE\s*:\s*(\d{2}-\d{2}-\d{4})'
# Search for the date pattern in the extracted text
date_match = re.search(date_pattern, extracted_text)

# If a match is found, extract the date
if date_match:
    date = date_match.group(1)
    print("Date:", date)
else:
    print("Date not found in the invoice.")