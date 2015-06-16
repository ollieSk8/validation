(function(){
	var pageInit={
		init:function(){
			var s=this;
			s.oInput=document.getElementsByTagName('input');
			s.oSpan=document.getElementsByTagName('span');
			s.total_zifu=document.getElementById('total_zifu');
			s.password_status=document.querySelector('.password-status');
			s.oEm=s.password_status.getElementsByTagName('em');
			s.username_input=s.oInput[0];
			s.password_input=s.oInput[1];
			s.repass_input=s.oInput[2];
			s.username_msg=s.oSpan[0];
			s.password_msg=s.oSpan[1];
			s.repass_msg=s.oSpan[2];
			s.name_length=0;
			s.password_first_blur='';
			s.username_vali();
			s.password_vali();
			s.repass_vali();
		},
		eventFn:function(obj,type,callback){
			if(obj.addEventListener){
				obj.addEventListener(type,callback,false);
			}else{
				obj.attachEvent('on'+type,callback);
			}
		},
		getLength:function(str){
			//全局匹配非单字节的汉字用‘xx’替换，算出长度
			return str.replace(/[^\x00-xff]/g,'xx').length;
		},
		findStr:function(str,n){
			//循环字符串的长度，判断字符串的每一位和 n这个字符比较，如果等于n这个字符串tmp+1个
			//返回tmp
			var tmp=0;
			for(var i=0;i<str.length;i++){
				if(str.charAt(i)==n){
					tmp++;
				}
			}
			return tmp;
		},
		username_vali:function(){
			var s=this; 
			// 规则：1，数字、字母（不分大小写）、汉子、下划线
			// 规则：2，6-25个字符，推荐使用中文
			//  \u4e00-\u9fa5
			var re=/[^\w\u4e00-\u9fa5]/g; //不合法字符
			//用户名
			var us_input=s.username_input;
			var us_msg=s.username_msg;
			//用户名输入得到焦点
			s.eventFn(us_input,'focus',function(){
				us_msg.style.display='inline-block';
				us_msg.innerHTML='<i class="warn"></i><p>6-25个字符,一个汉字为2个字符,推荐使用中文</p>';
			});
			//用户名输入按键抬起
			s.eventFn(us_input,'keyup',function(){
				s.total_zifu.style.display='block';
				//获取用户名的长度
				s.name_length=s.getLength(us_input.value);
				s.total_zifu.innerHTML=s.name_length+'个字符';
				if(s.name_length==0){
					s.total_zifu.style.display='none';
				}
			});
			//用户输入失去焦点
			s.eventFn(us_input,'blur',function(){
				//含有非法字符
				if(re.test(this.value)){
					us_msg.innerHTML='<i class="error"></i><p>含有非法字符!</p>';
				}
				//不能为空
				else if(this.value==''){
					us_msg.innerHTML='<i class="error"></i><p>用户名不能为空!</p>';
				}
				//长度超过25个字符
				else if(s.name_length>25){
					us_msg.innerHTML='<i class="error"></i><p>用户名超过25个字符!</p>';
				}
				//长度少于6个字符
				else if(s.name_length<6){
					us_msg.innerHTML='<i class="error"></i><p>用户名少于6个字符!</p>';
				}
				//验证通过
				else{
					us_msg.innerHTML='<i class="accept"></i><p></p>';
					s.total_zifu.style.display='none';
				}
			});
		},
		password_vali:function(){
			var s=this;
			var pass_input=s.password_input;
			var pass_msg=s.password_msg;
			var repass_input=s.repass_input;
			var repass_msg=s.repass_msg;
			//密码获得焦点
			s.eventFn(pass_input,'focus',function(){
				pass_msg.style.display='inline-block';
				pass_msg.innerHTML='<i class="warn"></i><p>密码使用字母,数字,下划线组合！</p>';
			});
			//密码抬起
			s.eventFn(pass_input,'keyup',function(){
				//大于5个字符定为中
				if(this.value.length>5){
					s.oEm[1].className='active';
					repass_input.removeAttribute('disabled');
					repass_input.className='';
					repass_msg.style.display='inline-block';
				}else{
					s.oEm[1].className='';
					repass_input.setAttribute('disabled','');
					repass_input.className='disabled';
					repass_msg.style.display='none';
					
				}
				//大于10个字符定为强
				if(this.value.length>10){
					s.oEm[2].className='active';
				}else{
					s.oEm[2].className='';
				}
			});
			//密码失去焦点
			s.eventFn(pass_input,'blur',function(){
	            var total_same=s.findStr(this.value,this.value[0]);
				var all_re_number=/[^\d]/g;// 如果匹配到非数字
				var all_re_letter=/[^a-zA-Z]/g;//如果匹配到非字母
				//不能为空
				if(this.value==''){
					pass_msg.innerHTML='<i class="error"></i><p>密码不能为空！</p>';
				}
				//不能用相同字符
				else if(total_same==this.value.length){
					pass_msg.innerHTML='<i class="error"></i><p>密码不能为相同字符！</p>';
				}
				//长度应为6-16个字符
				else if(this.value.length<6||this.value.length>16){
					pass_msg.innerHTML='<i class="error"></i><p>密码应为6-16个字符！</p>';
				}
				//不能全是数字
				else if(!all_re_number.test(this.value)){
					pass_msg.innerHTML='<i class="error"></i><p>密码不能全为数字！</p>';
				}
				//不能全为字母
				else if(!all_re_letter.test(this.value)){
					pass_msg.innerHTML='<i class="error"></i><p>密码不能全为字母！</p>';
				}
				//OK
				else{
					pass_msg.innerHTML='<i class="accept"></i>';
					s.password_first_blur=this.value;
				}
			});
		},
		//确认输入密码
		repass_vali:function(){
			var s=this;
			var repass_input=s.repass_input;
			var repass_msg=s.repass_msg;
			s.eventFn(repass_input,'blur',function(){
				//如果两次密码相等则ok
				if(this.value==s.password_first_blur){
					repass_msg.innerHTML='<i class="accept"></i>';
				}else{
					repass_msg.innerHTML='<i class="error"></i><p>两次密码不相同！</p>';	
				}
			});
		}
	};
	window.onload=function(){
		pageInit.init();
	};
})();