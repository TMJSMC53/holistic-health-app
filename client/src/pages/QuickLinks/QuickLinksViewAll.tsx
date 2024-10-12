import { useState, useEffect } from 'react';
import QuickLinksUpdateForm from '../QuickLinks/QuickLinksUpdateForm';
import QuickLinksDeleteForm from './QuickLinksDeleteForm';
import QuickLinksCreateForm from './QuickLinksCreateForm';

export interface QuickLinks {
  _id: string;
  name: string;
  url: string;
  isFavorite: boolean;
}
const QuickLinksViewAll = () => {
  const [links, setLinks] = useState<QuickLinks[]>([]);
  const [favorites, setFavorites] = useState<QuickLinks[]>([]);

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
        setFavorites(
          data.filter((favorite: QuickLinks) => favorite.isFavorite)
        );
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    getQuickLinksList();
  }, []);

  return (
    <>
      <div>
        <div className="flex justify-end">
          <QuickLinksCreateForm />
        </div>
        <section className="p-[4px] mx-2 bg-gradient-to-r from-primary-400 via-primary-600 to-primary-700 border-gradient">
          <div className="bg-white border-gradient">
            <p className="text-14 md:text-18 text-primary-600 font-poppins font-medium pt-2 mx-4">
              Favorites:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 mx-2">
              {favorites.map((favoriteLink) => (
                <div key={favoriteLink._id}>
                  <div className="flex place-items-center">
                    <a
                      href={favoriteLink.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-12 md:text-16 py-0.5 px-2 text-primary-600 font-poppins hover:underline"
                    >
                      {favoriteLink.name}
                    </a>
                    <QuickLinksUpdateForm link={favoriteLink} />
                    <QuickLinksDeleteForm link={favoriteLink} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <div className="grid grid-cols-2 md:grid-cols-3 mx-2 my-8">
          {links.map((link) => (
            <div className=" mb-4" key={link._id}>
              <div className="flex place-items-center">
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-12 md:text-16 py-0.5 px-2 text-primary-600 font-poppins hover:underline"
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
