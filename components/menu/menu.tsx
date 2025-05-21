import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
// import Product, { Products } from "../../models/products";
import { Products } from "../../models/products";
import { useSession } from 'next-auth/react';
import { globalMenCategories, globalWomenCategories } from '../postProduct/postProduct'
import { signOut } from 'next-auth/react';
type Props = {
  menuData: string
}
const contentType = "application/json";
const globalBrands = ['  any', 'H&M', 'Zara', 'Topshop', 'Paragon', 'Nike', 'Puma', 'Urban Outfitters', '   1hahahha', '2hahahha', '3hahahha', '4hahahha', '5hahahha', '6hahahha', '7hahahha', '8hahahha', '9hahahha'];
// const globalBrands = ['any', 'H&M', 'Zara', 'Topshop', 'Paragon', 'Nike', 'Puma', 'Urban Outfitters', '1hahahha', '2hahahha', '3hahahha', '4hahahha', '5hahahha', '6hahahha',];
const MenuBar = ({ menuData }: Props) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [productBrands, setProductBrands] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDesktopView, setIsDesktopView] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [activeContent, setActiveMenuContent] = useState<string | null>(null);
  // Show/hide menu dropdown on small view port/
  const [isHidden, setIsHidden] = useState(true);
  const hamburgerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);

  // A Set automatically ignores duplicates, so a value in the set may only occur once; 
  // const seen = new Set<string>();
  const findDuplicate = new Set<string>();
  const storeBrands: string[] = [];
  // fetching data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/products', {
          method: 'GET',
          headers: {
            Accept: contentType,
            "Content-Type": contentType,
          },
        });
        const data = await res.json();
        const dataAsString = JSON.parse(JSON.stringify(data));
        dataAsString?.data?.map((elem: { brand: string }, index: number) => {
          const lower = elem.brand.toLowerCase();
          // we check to see whether we've already encountered the string
          if (!findDuplicate.has(lower)) {
            // We're adding the lowercased version of the elem.brand string to the set.
            findDuplicate.add(lower);
            storeBrands.push(elem.brand)
          }
        });
        // set the state and sort barnds alphabetically
        setProductBrands(storeBrands.sort((a, b) => a.localeCompare(b)));
      } catch (err) {
        setError('Failed to load brands');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // handle to get size of the window to display mobile menu or desktop menu  
  useEffect(() => {
    const handleResize = () => {
      // if the width of the window is smaller than 768px, then we would setIsDesktopView to FALSE.
      setIsDesktopView(!(window.innerWidth < 768)); // FALSE if width < 768      
    }
    handleResize(); // Check immediately on load (like onLoad)
    window.addEventListener('resize', handleResize); // add window resizing event
    return () => window.removeEventListener('resize', handleResize); // remove window resizing event
  }, []);

  // In case our brand array get larger then 8 elements, we would split then in to two arraies. 
  // firstColumn takes from 0 to 8 elements 
  const firstColumn = productBrands.slice(0, 8);
  // secondColumn takes elements from 8 to 15. its 15 so if the productBrands is more than 16 elements, we are not display all of them.
  const secondColumn = productBrands.length > 8 ? productBrands.slice(8, 15) : [];

  // Handle Hamburger dropdown button  
  const toggleMenu = () => {
    setIsOpen(prev => !prev); // toggle hamburger button
    setActiveMenuContent(null); // reset/close hamburger menu content.
  };

  // Handle closing menu dropdown when user click outside of it's box.
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node; // telling TypeScript: “I know this is a Node.”
      if (hamburgerRef.current && !hamburgerRef.current.contains(target) && dropdownRef.current && !dropdownRef.current.contains(target)) {
        setIsOpen(false); // close the hamburger         
        setActiveMenuContent(null); // close hamburger content or menu content.
      }
    };
    // Handle close the dropdown on route change
    const handleRouteChange = () => {
      setIsOpen(false); // Close the dropdown on route change
      setActiveMenuContent(null); // close hamburger content or menu content.
    };
    document.addEventListener('mousedown', handleClickOutside); // When user click outside of the dropdown initiate handleClickOutside().
    // What router.events.on() does is, it adds a listener for a specific routing event in Next.js. 
    router.events.on('routeChangeStart', handleRouteChange); // when user navigates to other page, we would initiate handleRouteChange() to close menut dropdow and its content.
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      // What router.events.off() does is, it removes/(unsubscribes) the listener you added with router.events.on().
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [router]);
  // Handle toggle dropdown menu content
  const toggleMenuContent = (index: string) => {
    setActiveMenuContent(prevIndex => {
      const newIndex = prevIndex === index ? null : index;
      setTimeout(() => {
        hamburgerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start', }); // scroll Into View dropdown menu content
      }, 0); // ensure DOM updates before focusing
      return newIndex;
    });
  };
  return (
    <>
      {isDesktopView ? (
        <div className="block p-1.5 h-10 border-b">
          <ul className="flex items-center">
            <li className="inline ml-4 mr-16 w-14 hover:border-t-2 border-slate-400"><Link href={'/menu/newItems'}>New In</Link></li>
            <li className="inline mr-16 group w-12 hover:border-t-2 border-slate-400">
              <span>Men's</span>
              <ul className=" hidden group-hover:block group-hover:relative bg-white w-48  z-10 top-1.5 p-2 border rounded ">
                <p className="font-bold text-lg mb-2">Shop by Category</p>
                {globalMenCategories.map((elem, index) => (
                  <li key={index} className="p-0.5 m-1 hover:text-slate-400">
                    <Link href={'/menu/' + 'm' + elem.toLowerCase()}> {elem}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            <li className="inline mr-16 group w-16 hover:border-t-2 border-slate-400 ">
              <span>Women's</span>
              <ul className="hidden group-hover:block group-hover:relative bg-white w-48 z-10 top-1.5 p-2 border rounded ">
                <p className="font-bold text-lg mb-2">Shop by Category</p>
                {globalWomenCategories.map((elem, index) => (
                  <li key={index} className=" p-0.5 m-1 hover:text-slate-400">
                    <Link href={'/menu/' + 'w' + elem.toLowerCase()}> {elem}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            <li className="inline mr-16 group w-12 hover:border-t-2 border-slate-400 ">
              <span>Brands</span>
              <div className={` hidden group-hover:block group-hover:relative flex-col bg-white ${secondColumn.length > 0 ? 'w-80' : 'w-48'}  z-10 top-1.5 p-2 border rounded`}  >
                <p className="font-bold text-lg mb-2">Shop by Brand</p>
                <div className="flex gap-4">
                  {loading && <p className="text-gray-500">Loading...</p>}
                  {error && <p className="text-red-500">{error}</p>}
                  {!loading && !error && (
                    <>
                      <ul>
                        {firstColumn.map((elem, index) => (
                          <li key={index} className=" p-0.5 m-1 hover:text-slate-400">
                            <Link href={`/menu/${encodeURIComponent(elem.trim())}`}>{elem}</Link>
                          </li>
                        ))}
                      </ul>
                      {secondColumn.length > 0 && (
                        <ul>
                          {secondColumn.map((elem, index) => (
                            <li key={index} className=" p-0.5 m-1 hover:text-slate-400">
                              <Link href={`/menu/${encodeURIComponent(elem.trim())}`}>{elem}</Link>
                            </li>
                          ))}
                          {productBrands.length > 15 && (
                            <li className=" p-0.5 m-1 hover:text-slate-400" >More Brands...</li>
                          )}
                        </ul>
                      )}
                    </>
                  )}
                </div>
              </div>
            </li>
            {status === 'authenticated' && (
              <li className="ml-auto border rounded-md px-2 float-right mr-3 ">
                <Link href={'/new'} className="flex items-center ">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 border rounded-full  mr-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  Add Product
                </Link>
              </li>
            )}
          </ul>
        </div>
      ) : (
        <>
          <div className='menuContainer '>
            <div className='menuButton' ref={hamburgerRef} onClick={toggleMenu}>
              <div className={`bar ${isOpen ? 'open1' : ''}`} />
              <div className={`bar ${isOpen ? 'open2' : ''}`} />
              <div className={`bar ${isOpen ? 'open3' : ''}`} />
            </div>
            {isOpen && (
              <ul className='dropdownMenu' ref={dropdownRef}>
                <li className="py-3 pr-7 pl-4 cursor-pointer underline-offset-2 decoration-slate-400 decoration-2 hover:underline">
                  <Link className="w-full inline-block" href={'/menu/newItems'}>New In</Link>
                </li>
                <li className="border-t py-3 pr-7 pl-4 cursor-pointer " onClick={() => toggleMenuContent('Mens')}>
                  <span className="underline-offset-2 decoration-slate-400 decoration-2 hover:underline">Men's</span>
                  <span className="float-right  text-2xl leading-6 ">{activeContent === 'Mens' ? '−' : '+'}</span>
                  <ul className={`${activeContent === 'Mens' ? ' ' : "hidden"}  bg-white w-48 z-10 top-1.5 p-2 border rounded text-sm`}>
                    {globalMenCategories.map((elem, index) => (
                      <li key={index} className="m-1 hover:text-slate-400 p-1.5 border-b">
                        <Link href={'/menu/' + 'm' + elem.toLowerCase()}> {elem}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
                <li className="border-t py-3 pr-7 pl-4 cursor-pointer " onClick={() => toggleMenuContent('Womens')}>
                  <span className="underline-offset-2 decoration-slate-400 decoration-2 hover:underline">Women's</span>
                  <span className="float-right text-2xl leading-6 ">{activeContent === 'Womens' ? '−' : '+'}</span>
                  <ul className={`${activeContent === 'Womens' ? ' ' : "hidden"}  bg-white w-48 z-10 top-1.5 p-2 border rounded text-sm`}>
                    {globalWomenCategories.map((elem, index) => (
                      <li key={index} className="m-1 hover:text-slate-400 p-1.5 border-b">
                        <Link href={'/menu/' + 'w' + elem.toLowerCase()}> {elem}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
                <li className="border-t py-3 pr-7 pl-4 cursor-pointer " onClick={() => toggleMenuContent('Brands')}>
                  <span className="underline-offset-2 decoration-slate-400 decoration-2 hover:underline">Brands</span>
                  <span className="float-right text-2xl leading-6 ">{activeContent === 'Brands' ? '−' : '+'}</span>
                  {/* <ul className="hidden group-hover:block group-hover:relative  bg-white w-48 z-10 top-1.5 p-2 border rounded text-sm"> */}
                  <ul className={`${activeContent === 'Brands' ? ' ' : "hidden"}  bg-white w-48 z-10 top-1.5 p-2 border rounded text-sm `}>

                    {productBrands.map((elem, index) => (
                      <li key={index} className="m-1 hover:text-slate-400 p-1.5 border-b ">
                        <Link href={'/menu/' + 'm' + elem.toLowerCase()}> {elem}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              </ul>
            )}
          </div>
          {status === 'authenticated' && (
            <div className=" border rounded-md absolute left-[45%] top-[66px] h-7  w-auto -translate-x-1/2 pl-1 pr-2">

              <Link href={'/new'} className="flex py-0.5 items-center ">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 border rounded-full  mr-1 ">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                New
              </Link>
            </div>
          )}
        </>
      )}
    </>
  )

}
export default MenuBar;