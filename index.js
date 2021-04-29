const puppeteer = require('puppeteer')
require('dotenv').config()


function wait(n=100){
	return new Promise(r => setTimeout(r, n))
}

async function clickOn(page, selector){
	await page.waitForSelector(selector)
	const item = await page.$(selector)
	await item.click()
	
	await wait(600)
	
	return item
}

async function fillInputs(page, inputs){
	for(let s of Object.keys(inputs)){
		
		await page.focus(s)
		await page.keyboard.type(inputs[s])
		
		await wait(600)
	}
}

async function getData(){
	
	const browser = await puppeteer.launch({headless: false})
	const page = await browser.newPage()
	
	await page.goto('https://covid19results.ehealthontario.ca:4443/agree')

	await clickOn(page, 'label[for=id-type-ohc]')
	await clickOn(page, '#btn_step2_ohc_known')
	await clickOn(page, '#cp-agreement_acceptedTerm1_label')
	await clickOn(page, '#button_submit')
	
	await fillInputs(page, {
		'#hcn': process.env.CARD_NUMBER,
		'#vCode': process.env.VERSION_CODE,
		'#scn': process.env.BACK_CODE,
		'#fname': process.env.FIRST_NAME,
		'#lname': process.env.LAST_NAME,
		'#dob-igc-yyyy': process.env.DOB_YEAR,
		'#dob-igc-mm': process.env.DOB_MONTH,
		'#dob-igc-dd': process.env.DOB_DAY,
	})
	
	await clickOn(page, 'label[for=gender-male]')
	
	await fillInputs(page, {
		'#pCode': process.env.POSTAL_CODE,
	})
	
	await wait(1000)
	
	await clickOn(page, '#button_verify')
}

getData()