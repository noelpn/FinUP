import app

client = app.app.test_client()
with client.session_transaction() as session:
    session['user'] = 'demo@example.com'

for path in ['/dashboard', '/expenses', '/analytics', '/budget', '/suggestions']:
    response = client.get(path)
    print(path, response.status_code, 'ok' if response.status_code == 200 else response.status_code)
    body = response.get_data(as_text=True)
    print('  contains title:', 'Dashboard' in body or 'Expenses' in body or 'Analytics' in body or 'Budget' in body or 'Suggestions' in body)
