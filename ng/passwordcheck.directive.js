angular.module('app').directive('passwordCheck',function(){
	
	return{
		 require: 'ngModel',
      link: function (scope, elem, attrs, ctrl) {
        var firstPassword = '#' + attrs.passwordCheck;
        console.log('firstPassword',firstPassword)
        console.log('elem',elem)
        $(elem).add(firstPassword).on('keyup', function () {
          scope.$apply(function () {
          	console.log('pwcheck','in apply')
            var v = elem.val()===$(firstPassword).val();
            console.log("val",v);
            ctrl.$setValidity('pwmatch', v);
          });
        });
      }
    }
	}
)