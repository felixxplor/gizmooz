import AmazonLogo from '~/assets/Amazon.svg';
import SydneyLogo from '~/assets/Sydney.svg';
import BloombergLogo from '~/assets/Bloomberg.svg';
import GuardianLogo from '~/assets/Guardian.svg';
import InsiderLogo from '~/assets/Insider.svg';
import MediumLogo from '~/assets/Medium.svg';
import AfterpayLogo from '~/assets/Afterpay.svg';
import FacebookLogo from '~/assets/Facebook.svg';
import GoogleLogo from '~/assets/Google.svg';
import PayPalLogo from '~/assets/PayPal.svg';
import ShopifyLogo from '~/assets/Shopify.svg';
import StripeLogo from '~/assets/Stripe.svg';
import GooglePayLogo from '~/assets/GooglePay.svg';
import MicrosoftLogo from '~/assets/Microsoft.svg';
import FedExLogo from '~/assets/FedEx.svg';
import MastercardLogo from '~/assets/Mastercard.svg';
import ApplePayLogo from '~/assets/ApplePay.svg';
import ABCLogo from '~/assets/ABC.svg';
import WestfieldLogo from '~/assets/Westfield.svg';

const logos = [
  {label: 'Amazon', url: AmazonLogo},
  {label: 'Sydney Morning Herald', url: SydneyLogo},
  {label: 'Bloomberg', url: BloombergLogo},
  {label: 'Guardian', url: GuardianLogo},
  {label: 'Insider', url: InsiderLogo},
  {label: 'Facebook', url: FacebookLogo},
  {label: 'Google', url: GoogleLogo},
  {label: 'Microsoft', url: MicrosoftLogo},
  {label: 'FedEx', url: FedExLogo},
  {label: 'Shopify', url: ShopifyLogo},
  {label: 'Stripe', url: StripeLogo},
  {label: 'PayPal', url: PayPalLogo},
  {label: 'Mastercard', url: MastercardLogo},
  {label: 'Apple Pay', url: ApplePayLogo},
  {label: 'Google Pay', url: GooglePayLogo},
  {label: 'Afterpay', url: AfterpayLogo},
  {label: 'Medium', url: MediumLogo},
  {label: 'ABC', url: ABCLogo},
  {label: 'Westfield', url: WestfieldLogo},
];

export function LogoCarousel() {
  return (
    <section className="section-container py-10 sm:py-14">
      <h2 className="text-sm sm:text-base font-semibold text-center text-brand-900 mb-6">
        Trusted by leading brands worldwide
      </h2>

      <div className="relative overflow-hidden">
        {/* Gradient fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-32 bg-linear-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-32 bg-linear-to-l from-white to-transparent z-10 pointer-events-none" />

        <div
          className="flex py-8 border-t border-b border-brand-100"
          style={{
            animation: 'logo-scroll 40s linear infinite',
            width: 'max-content',
          }}
        >
          {/* Render logos twice — each in identical wrapper for seamless loop */}
          {[0, 1].map((setIndex) => (
            <div
              key={setIndex}
              className="flex items-center gap-12 sm:gap-16 shrink-0 pr-12 sm:pr-16"
            >
              {logos.map((logo) => (
                <div
                  key={`${logo.label}-${setIndex}`}
                  className="shrink-0 w-20 sm:w-28 h-10 sm:h-12 flex items-center justify-center"
                >
                  <img
                    src={logo.url}
                    alt={logo.label}
                    className="max-w-full max-h-full object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
