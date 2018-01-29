import requests
import time


def gen():
    yield 'correct'
    yield 'horse'
    yield 'battery'
    yield 'staple'

resp = requests.post('https://cloudflareworker.pw/', data=gen())


print resp.headers.get('Content-Type')
print resp.text
