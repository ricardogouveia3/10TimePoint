# 10TimePoint

This is a simple extension to convert time from HH:MM into a decimal number. Useful for work timesheets.

## Usage

Simply enter time on the check-in and check-out fields and click convert.

## Features

- The extension converts time from inputs into a decimal value, displayed on decimal field.
- Value is persistant, saved on localStorage
- The clear button should also clear localStorage saved values
- Calculating with invalid values results in return e
- A mask on input values tries to prevent invalid entries
- The version is retrivied from the manifest file

## Contributing

Contributions are highly appreciated. This project has some to-dos:

- Implement copying result value when clicking
- Enable a disabled field Duration, that should display the difference between time inputs in HH:MM
- Any possible optimzation or useful new feature :)