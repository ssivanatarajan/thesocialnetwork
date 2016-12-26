var chai=require('chai')
chai.use(require('chai-as-promised'))
var expect=chai.expect
describe('making a post', function () {
  it('logs in and creates a new post', function () {
    browser.get('http://localhost:3001')
    element(by.css('nav .login')).click()
    //browser.pause()
    var username='siva'
    element(by.model('username')).sendKeys(username)
	element(by.model('password')).sendKeys('pass')
	element(by.css('form .btn')).click()
	var post='test post'+Math.random()
	element(by.model('postBody')).sendKeys(post)

	element(by.id('addPost')).click()
	console.log(post)
	expect(element.all(by.css('ul.list-group li')).first().getText()).to.eventually.contain('@'+username+' '+post)
	browser.pause()
    // click 'login'
    // fill out and submit login form
    // submit a new post on the posts page

    // the user should now see their post as the first post on the page
  })
})