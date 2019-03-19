//设置获取验证码的key
export function setverificationCodeKey(key) {
    return localStorage.setItem('verificationCode_key', key);
}
export function getverificationCodeKey() {
    return  localStorage.getItem('verificationCode_key');
}