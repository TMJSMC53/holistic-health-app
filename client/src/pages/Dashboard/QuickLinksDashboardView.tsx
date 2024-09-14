import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import QuickLinksUpdateForm from '../QuickLinks/QuickLinksUpdateForm';
import QuickLinksDeleteForm from '../QuickLinks/QuickLinksDeleteForm';

export interface QuickLinks {
  _id: string;
  name: string;
  url: string;
}
const QuickLinks = () => {
  const [links, setLinks] = useState<QuickLinks[]>([]);
  // const [selectedLink, setSelectedLink] = useState<QuickLinks | null>(null);

  useEffect(() => {
    const getQuickLinksList = async () => {
      try {
        const response = await fetch(`/api/quickLinks`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        const data = await response.json();
        console.log('Fetched Links:', data);
        setLinks(data);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    getQuickLinksList();
  }, []);

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mx-2">
        {links.slice(0, 6).map((link, index) => (
          <div
            className={`outline outline-1 outline-accents-100 flex place-items-center mb-4 ${
              index % 2 === 0 ? '' : 'justify-end md:justify-start'
            }`}
            key={link._id}
          >
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-14 md:text-16 py-0.5 px-2 md:px-4 text-primary-600 font-poppins hover:underline"
            >
              {link.name}
            </a>

            <QuickLinksUpdateForm link={link} />
            <QuickLinksDeleteForm link={link} />
          </div>
        ))}
        {/* {selectedLink}  */}
      </div>
      <div className="lg:text-20 text-center text-primary-600 mt-4 mb-8 hover:underline">
        <Link className="view-all p-2" to="/quickLinks">
          All Links
        </Link>
      </div>
    </div>
  );
};

export default QuickLinks;
