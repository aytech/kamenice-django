import os

import pytest as pytest
from selenium import webdriver
from selenium.webdriver import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions
from selenium.webdriver.support.wait import WebDriverWait

APP_URL = 'http://localhost:3000/'
USERNAME = os.getenv('APP_USER')
PASSWORD = os.getenv('APP_PASSWORD')


@pytest.fixture(params=['chrome'], scope='class')
def driver_init(request):
    if request.param == "firefox":
        request.cls.driver = webdriver.Firefox()
    else:
        request.cls.driver = webdriver.Chrome()
    yield
    # request.cls.driver.close()


def login(driver):
    user_input = WebDriverWait(driver, 10).until(
        expected_conditions.presence_of_element_located((By.ID, 'login_username')))
    user_password = WebDriverWait(driver, 10).until(
        expected_conditions.presence_of_element_located((By.ID, 'login_password')))
    submit_button = WebDriverWait(driver, 10).until(
        expected_conditions.presence_of_element_located((By.CLASS_NAME, 'ant-btn-primary')))
    user_input.clear()
    user_password.clear()
    user_input.send_keys(USERNAME)
    user_password.send_keys(PASSWORD)
    submit_button.send_keys(Keys.RETURN)
    WebDriverWait(driver, 10).until(
        expected_conditions.presence_of_element_located((By.CLASS_NAME, 'ant-menu'))
    )
