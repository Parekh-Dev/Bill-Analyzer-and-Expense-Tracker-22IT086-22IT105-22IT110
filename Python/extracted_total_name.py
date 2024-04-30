from PIL import Image
import pytesseract
import re

def process_image(image_path):
    # Open the image
    image = Image.open(image_path)
    # Use pytesseract to extract text from the image
    extracted_text = pytesseract.image_to_string(image)
    return extracted_text

def extract_total_amount(text):
    # Define a regular expression pattern to match the total amount
    total_amount_pattern = r'TOTAL:\s*(\d+)'
    # Search for the total amount pattern in the extracted text
    total_amount_match = re.search(total_amount_pattern, text, re.IGNORECASE)
    # If a match is found, extract the total amount
    if total_amount_match:
        total_amount = total_amount_match.group(1)
        # Remove commas from the total amount and convert it to a float
        total_amount = float(total_amount.replace(',', ''))
        return total_amount
    else:
        return "Total amount not found in the invoice."

def extract_name(text):
    # Define a regular expression pattern to match the text below "Bill To"
    bill_to_pattern = r'BILLED TO:\s*(.+)'
    # Search for the "Bill To" pattern in the extracted text
    bill_to_match = re.search(bill_to_pattern, text)
    # If a match is found, extract the text below "Bill To"
    if bill_to_match:
        return bill_to_match.group(1).strip()
    else:
        return "Cannot found Name of the Owner"

def extract_date(text):
    # Define a regular expression pattern to match the date
    date_pattern = r'DATE\s*:\s*(\d{2}-\d{2}-\d{4})'
    # Search for the date pattern in the extracted text
    date_match = re.search(date_pattern, text)
    # If a match is found, extract the date
    if date_match:
        return date_match.group(1)
    else:
        return "Date not found in the invoice."

def main():
    # Provide the path to the image file
    image_path = 'D:\\Bill-Analyzer-and-Expense-Tracker-22IT086-22IT105-22IT110\Python\stationery.png'
    # Process the image
    extracted_text = process_image(image_path)
    # Extract total amount, name, and date from the text
    total_amount = extract_total_amount(extracted_text)
    name = extract_name(extracted_text)
    date = extract_date(extracted_text)
    # Print the extracted information
    print("Total Amount:", total_amount)
    print("Name:", name)
    print("Date:", date)

if __name__ == '__main__':
    main()
