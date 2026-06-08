# CA Client Document Reminder Automation

A Google Apps Script automation system built for CA firms to eliminate manual follow-up on client document collection.

## Problem Solved
CA firms spend hours every week manually reminding clients to submit documents (ITR, Balance Sheets, GST Returns). This system automates the entire process.

## What It Does
- Reads client list from Google Sheets
- Automatically sends reminder emails to Pending and Overdue clients daily at 9 AM
- Skips clients who have already submitted (Received status)
- Logs every action with timestamp in a Logs sheet
- Updates a live Dashboard with Pending / Received / Overdue counts

## Tech Stack
- Google Apps Script (JavaScript)
- Google Sheets (data layer)
- Gmail via MailApp API

## How to Use
1. Copy the Google Sheet template (Clients, Logs, Dashboard tabs)
2. Paste Code.gs into Apps Script editor
3. Run `setDailyTrigger()` once to activate daily automation
4. Add clients to the Clients sheet and set their status

## Business Impact
- Saves 2-3 hours/week of manual follow-up
- Zero missed reminders
- Full audit trail via Logs sheet

## Author
Varun Kumar | [LinkedIn](https://linkedin.com/in/varunkumar-ai)
