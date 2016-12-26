describe('registering a user',function(){
	it('give username and password',function(){
		browser.get('http://localhost:3001/register')
		element(by.model('username')).sendKeys('testUser')
		element(by.model('password')).sendKeys('testpassword')
		element(by.css('form .btn')).click()

	})
})