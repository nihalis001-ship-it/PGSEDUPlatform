export interface DCSError {
  code: string;
  meaning: { tr: string; en: string };
  cause: { tr: string; en: string };
  solution: { tr: string; en: string };
  passengerMessage: { tr: string; en: string };
}

export const DCS_ERRORS: DCSError[] = [
  {
    code: 'ERR-213',
    meaning: {
      tr: 'Pasaport Verisi Uyuşmazlığı',
      en: 'Passport Data Mismatch'
    },
    cause: {
      tr: 'Pasaport numarası veya son kullanma tarihi rezervasyon verileriyle eşleşmiyor.',
      en: 'Passport number or expiry date does not match reservation data.'
    },
    solution: {
      tr: 'Pasaportu tekrar tarayın veya verileri manuel olarak kontrol edip güncelleyin.',
      en: 'Re-scan the passport or manually check and update the data.'
    },
    passengerMessage: {
      tr: 'Seyahat belgelerinizi doğrulamak için bilgilerinizi tekrar kontrol etmemiz gerekiyor. Lütfen pasaportunuzu hazır bulundurun.',
      en: 'We need to double-check your information to verify your travel documents. Please have your passport ready.'
    }
  },
  {
    code: 'INV-SSR',
    meaning: {
      tr: 'Geçersiz Özel Hizmet Talebi',
      en: 'Invalid Special Service Request'
    },
    cause: {
      tr: 'Sistem tarafından tanınmayan veya hatalı formatlanmış SSR kodu.',
      en: 'SSR code not recognized by the system or incorrectly formatted.'
    },
    solution: {
      tr: 'SSR kod kütüphanesini kontrol edin ve geçerli bir kod ile güncelleyin.',
      en: 'Check the SSR code library and update with a valid code.'
    },
    passengerMessage: {
      tr: 'Özel hizmet taleplerinizi güncelliyoruz. İşleminiz kısa süre içinde tamamlanacaktır.',
      en: 'We are updating your special service requests. Your transaction will be completed shortly.'
    }
  },
  {
    code: 'SEC-403',
    meaning: {
      tr: 'Güvenlik Onayı Reddedildi',
      en: 'Security Clearance Denied'
    },
    cause: {
      tr: 'Yolcunun ilgili otoritelerden uçuş izni alamaması.',
      en: 'Passenger failed to receive flight clearance from relevant authorities.'
    },
    solution: {
      tr: 'Yolcuyu güvenlik masasına veya süpervizöre yönlendirin.',
      en: 'Direct the passenger to the security desk or supervisor.'
    },
    passengerMessage: {
      tr: 'Belgeleriniz ek bir güvenlik doğrulaması gerektiriyor. Lütfen danışma masasına müracaat ediniz.',
      en: 'Your documents require additional security verification. Please apply to the information desk.'
    }
  },
  {
    code: 'BAG-99',
    meaning: {
      tr: 'Aşırı Bagaj Limiti',
      en: 'Excess Baggage Limit'
    },
    cause: {
      tr: 'Yolcunun ücretsiz bagaj hakkı sınırını aşması.',
      en: 'Passenger exceeded the free baggage allowance.'
    },
    solution: {
      tr: 'Ek bagaj ücretini tahsil edin veya yolcuyu ödeme noktasına yönlendirin.',
      en: 'Collect the excess baggage fee or direct the passenger to the payment point.'
    },
    passengerMessage: {
      tr: 'Bagaj hakkınızın üzerinde bir ağırlık tespit edildi. Ek ücret ödemesi için sizi ilgili bankoya yönlendirebilirim.',
      en: 'A weight above your baggage allowance has been detected. I can direct you to the relevant counter for additional fee payment.'
    }
  },
  {
    code: 'SSR-WCHC',
    meaning: {
      tr: 'WCHC Onayı Bekleniyor',
      en: 'WCHC Approval Pending'
    },
    cause: {
      tr: 'Tekerlekli sandalye (WCHC) talebinin operasyonel onay almaması.',
      en: 'Wheelchair (WCHC) request has not received operational approval.'
    },
    solution: {
      tr: 'Yer hizmetleri ve kabin ekibi ile koordinasyon sağlayarak onayı güncelleyin.',
      en: 'Update the approval by coordinating with ground services and cabin crew.'
    },
    passengerMessage: {
      tr: 'Tekerlekli sandalye talebiniz için ekiplerimizle koordinasyon sağlıyoruz. Lütfen bekleyiniz.',
      en: 'We are coordinating with our teams for your wheelchair request. Please wait.'
    }
  },
  {
    code: 'CHK-ONL',
    meaning: {
      tr: 'Online Check-in Hatası',
      en: 'Online Check-in Error'
    },
    cause: {
      tr: 'Yolcunun online check-in yaparken sistem hatası alması veya verilerin eşleşmemesi.',
      en: 'Passenger receiving a system error during online check-in or data mismatch.'
    },
    solution: {
      tr: 'Manuel check-in yaparak yeni biniş kartı oluşturun.',
      en: 'Perform manual check-in and create a new boarding pass.'
    },
    passengerMessage: {
      tr: 'Online check-in işleminizde bir aksaklık oluşmuş. Manuel olarak işleminizi tamamlayıp biniş kartınızı veriyorum.',
      en: 'There was a glitch in your online check-in process. I am completing your transaction manually and giving you your boarding pass.'
    }
  }
];
