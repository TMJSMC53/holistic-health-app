import { useState, useEffect } from 'react';
import QuickLinksUpdateForm from '../QuickLinks/QuickLinksUpdateForm';
import QuickLinksDeleteForm from './QuickLinksDeleteForm';

export interface QuickLinks {
  _id: string;
  name: string;
  url: string;
}
const QuickLinksViewAll = () => {
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
    <>
      <div className="">
        <div className="grid grid-cols-2 md:grid-cols-3 mx-2 my-8">
          {links.map((link) => (
            <div className=" mb-4" key={link._id}>
              <div className="flex place-items-center">
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-12 py-0.5 px-2 text-primary-600 font-poppins hover:underline"
                >
                  {link.name}
                </a>

                <QuickLinksUpdateForm link={link} />
                <QuickLinksDeleteForm link={link} />
              </div>
            </div>
          ))}
          {/* {selectedLink}  */}
        </div>
      </div>
    </>
  );
};

export default QuickLinksViewAll;
