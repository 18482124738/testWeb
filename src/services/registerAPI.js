import ServerHost from '../../config/server.config';
import request from '@/utils/request';

// 获取验证码
export async function getFakeCaptcha(params) {
  return request(`${ServerHost.VerificationCodeService}SendSms/SendSms`, {
    method: 'POST',
    body: { "mobile": params.mobile, "TemplateNo": params.TemplateNo }
  });
}

// 验证码验证是否正确
export async function verificationVerificationCode(params) {
  return request(`${ServerHost.VerificationCodeService}/SendSms/ValidationCode`, {
    method: 'POST',
    body: { "phone": params.loginCode, "code": params.code, "key": params.key }
  });
}


// 通过微信获取token
export async function fakeRegister(params) {
  return request(`${ServerHost.userCenterServer}/AuthUserInfo/RegsteredUser`, {
    method: 'POST',
    body: params,
  });
}
