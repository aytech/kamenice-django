import pytest
from selenium.common.exceptions import ElementClickInterceptedException
from selenium.webdriver import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions
from selenium.webdriver.support.wait import WebDriverWait

from tests.test_main import app, ElementIsAbsent


@pytest.mark.usefixtures('app')
class TestSuites:
    ROOM_NAME = 'Test Room'

    def navigate(self):
        self.driver.find_element(by=By.XPATH, value='//a[@href="/apartma"]').click()
        WebDriverWait(self.driver, 10).until(
            expected_conditions.presence_of_element_located((By.CLASS_NAME, 'suites'))
        )

    def test_create_suite(self):
        self.navigate()
        self.driver.find_element(by=By.CLASS_NAME, value='add-suite').click()
        WebDriverWait(self.driver, 10).until(
            expected_conditions.presence_of_element_located((By.CLASS_NAME, 'ant-drawer'))
        )
        self.driver.find_element(by=By.ID, value='suite_title').send_keys(self.ROOM_NAME)
        self.driver.find_element(by=By.ID, value='suite_beds').send_keys(2)
        self.driver.find_element(by=By.ID, value='suite_beds_extra').send_keys(2)
        self.driver.find_element(by=By.ID, value='suite_number').send_keys(1)

        price = self.driver.find_element(by=By.ID, value='suite_price_base')
        price.send_keys(Keys.CONTROL + 'a')
        price.send_keys(Keys.DELETE)
        price.send_keys(1400)

        self.driver.find_element(by=By.ID, value='add-discount-field').click()
        self.driver.find_element(by=By.ID, value='suite_discounts_0_type').click()
        self.driver.implicitly_wait(2)  # let the dropdown roll
        self.driver.find_element(by=By.XPATH, value='//div[@label="Dítě 3-12 let"]').click()
        self.driver.find_element(by=By.ID, value='suite_discounts_0_value').send_keys(50)
        self.driver.find_element(by=By.ID, value='add-discount-field').click()
        self.driver.find_element(by=By.ID, value='suite_discounts_1_type').click()
        self.driver.implicitly_wait(2)  # let the dropdown roll
        self.driver.find_elements(by=By.XPATH, value='//div[@label="Přistýlka"]')[1].click()
        self.driver.find_element(by=By.ID, value='suite_discounts_1_value').send_keys(40)
        self.driver.find_element(by=By.ID, value='add-discount-field').click()
        self.driver.find_element(by=By.ID, value='suite_discounts_2_type').click()
        self.driver.implicitly_wait(2)  # let the dropdown roll
        try:
            # key event is interrupted sometimes, possibly because of tooltips
            self.driver.find_elements(by=By.XPATH, value='//div[@label="Dítě do 3 let"]')[2].click()
        except ElementClickInterceptedException:
            self.driver.find_elements(by=By.XPATH, value='//div[@label="Dítě do 3 let"]')[2].click()
        self.driver.find_element(by=By.ID, value='suite_discounts_2_value').send_keys(100)
        self.driver.find_element(by=By.ID, value='add-discount-field').click()
        self.driver.find_element(by=By.ID, value='suite_discounts_3_type').click()
        self.driver.implicitly_wait(2)  # let the dropdown roll
        try:
            # key event is interrupted sometimes, possibly because of tooltips
            self.driver.find_elements(by=By.XPATH, value='//div[@label="Tři a více nocí"]')[3].click()
        except ElementClickInterceptedException:
            self.driver.find_elements(by=By.XPATH, value='//div[@label="Tři a více nocí"]')[3].click()
        self.driver.find_element(by=By.ID, value='suite_discounts_3_value').send_keys(12)

        assert self.driver.find_element(by=By.ID, value='add-discount-field').is_enabled() is False

        self.driver.find_element(by=By.ID, value='submit-suite').click()
        WebDriverWait(self.driver, 10).until(
            expected_conditions.presence_of_element_located((By.CLASS_NAME, 'ant-message'))
        )

        assert len(self.driver.find_elements(by=By.XPATH,
                                             value='//li[contains(@class, "suite-item")]//h4[text() = "{}"]'.format(
                                                 self.ROOM_NAME))) > 0

    def test_delete_cancel_suite(self):
        self.navigate()
        delete_button_path = '//li[contains(@class, "suite-item")]//h4[text() = "{}"]' \
                             '//..//..//..//ul//button[contains(@class, "delete-suite")]'.format(self.ROOM_NAME)
        self.driver.find_element(by=By.XPATH, value=delete_button_path).click()
        WebDriverWait(self.driver, 10).until(
            expected_conditions.presence_of_element_located((By.ID, 'delete-suite-confirm'))
        )
        self.driver.find_element(by=By.XPATH, value='//div[@id="delete-suite-confirm"]//button[. = "Ne"]').click()
        # Make sure item was not removed
        assert len(self.driver.find_elements(by=By.XPATH,
                                             value='//li[contains(@class, "suite-item")]//h4[text() = "{}"]'.format(
                                                 self.ROOM_NAME))) > 0

    def test_delete_suite(self):
        self.navigate()
        delete_button_path = '//li[contains(@class, "suite-item")]//h4[text() = "{}"]' \
                             '//..//..//..//ul//button[contains(@class, "delete-suite")]'.format(self.ROOM_NAME)
        self.driver.find_element(by=By.XPATH, value=delete_button_path).click()
        WebDriverWait(self.driver, 10).until(
            expected_conditions.presence_of_element_located((By.ID, 'delete-suite-confirm'))
        )
        self.driver.find_element(by=By.XPATH, value='//div[@id="delete-suite-confirm"]//button[. = "Ano"]').click()
        WebDriverWait(self.driver, 10).until(
            expected_conditions.presence_of_element_located((By.CLASS_NAME, 'ant-message'))
        )
        room_element_path = '//li[contains(@class, "suite-item")]//h4[text() = "{}"]'.format(self.ROOM_NAME)
        WebDriverWait(self.driver, 10).until(ElementIsAbsent((By.XPATH, room_element_path)))
        assert len(self.driver.find_elements(by=By.XPATH, value=room_element_path)) == 0
