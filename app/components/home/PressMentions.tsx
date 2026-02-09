export function PressMentions() {
  const press = [
    {name: 'TechCrunch', quote: '"The Smart Home Brand to Watch"'},
    {name: 'Wired', quote: '"Best Smart Devices of the Year"'},
    {name: 'The Verge', quote: '"Premium Tech at an Accessible Price"'},
    {name: 'Forbes', quote: '"Innovative Design Meets Function"'},
    {name: 'CNET', quote: '"Editor\'s Choice for Smart Living"'},
  ];

  return (
    <section className="py-16 sm:py-20 bg-brand-50">
      <div className="section-container">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-16 text-brand-900">
          As Seen In
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
          {press.map((item, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl font-bold text-brand-900 mb-3">
                {item.name}
              </div>
              <p className="text-sm text-brand-500 italic">{item.quote}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
