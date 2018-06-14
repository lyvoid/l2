from selenium import webdriver
import time


def xpaths_click(url, xpaths, phantom_path):
    driver = webdriver.PhantomJS(phantom_path)
    # driver = webdriver.Chrome()
    driver.maximize_window()
    driver.get(url)
    for click_element in xpaths:
        click = driver.find_element_by_xpath(click_element)
        click.click()
    time.sleep(1)
    driver.quit()

