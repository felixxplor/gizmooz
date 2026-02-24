import BloombergLogo from '~/assets/Bloomberg.svg';
import GuardianLogo from '~/assets/Guardian.svg';
import YahooLogo from '~/assets/Yahoo.svg';
import RedditLogo from '~/assets/Reddit.svg';
import MediumLogo from '~/assets/Medium.svg';

const press = [
  {name: 'Bloomberg', logo: BloombergLogo, quote: '"The Smart Home Brand to Watch"'},
  {name: 'The Guardian', logo: GuardianLogo, quote: '"Best Smart Devices of the Year"'},
  {name: 'Yahoo', logo: YahooLogo, quote: '"Premium Tech at an Accessible Price"'},
  {name: 'Reddit', logo: RedditLogo, quote: '"Innovative Design Meets Function"'},
  {name: 'Medium', logo: MediumLogo, quote: '"Editor\'s Choice for Smart Living"'},
];

export function PressMentions() {
  return (
    <section className="py-16 sm:py-20 bg-brand-50">
      <div className="section-container">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-16 text-brand-900">
          As Seen In
        </h2>

        <div
          className="flex items-start gap-8 sm:gap-10 overflow-x-auto sm:justify-center"
          style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}
        >
          {press.map((item, index) => (
            <div key={index} className="flex flex-col items-center text-center gap-3 flex-none">
              <img
                src={item.logo}
                alt={item.name}
                className="h-7 sm:h-10 w-auto object-contain grayscale opacity-70"
              />
              <p className="hidden sm:block text-sm text-brand-500 italic text-center max-w-[130px]">
                {item.quote}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
