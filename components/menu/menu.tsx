import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
// import Product, { Products } from "../../models/products";
import { Products } from "../../models/products";
import { useSession } from 'next-auth/react';
import { globalMenCategories, globalWomenCategories } from '../postProduct/postProduct'

type Props = {
  menuData: string
}
const contentType = "application/json";
const globalBrands = ['  any', 'H&M', 'Zara', 'Topshop', 'Paragon', 'Nike', 'Puma', 'Urban Outfitters', '   1hahahha', '2hahahha', '3hahahha', '4hahahha', '5hahahha', '6hahahha', '7hahahha', '8hahahha', '9hahahha'];
// const globalBrands = ['any', 'H&M', 'Zara', 'Topshop', 'Paragon', 'Nike', 'Puma', 'Urban Outfitters', '1hahahha', '2hahahha', '3hahahha', '4hahahha', '5hahahha', '6hahahha',];
const MenuBar = ({ menuData }: Props) => {
  const router = useRouter();
  const [productBrands, setProductBrands] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [width, setWidth] = useState<number | null>(null);
  // const [isViewPortSmall, setIsViewPortSmall] = useState(true);
  const [isDesktopView, setIsDesktopView] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<string | null>(null);
  // Show/hide menu dropdown on small view port/
  const [isHidden, setIsHidden] = useState(true);
  const hamburgerRef = useRef(null);
  const dropdownRef = useRef(null);


  // A Set automatically ignores duplicates, so a value in the set may only occur once; 
  // const seen = new Set<string>();
  const findDuplicate = new Set<string>();
  const storeBrands: string[] = [];
  console.log('===============activeIndex', activeIndex);
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
            // // adding only values that are unique. So we won't have duplicated value
            // setProductBrands(prev => [...prev, elem.brand])
          }
        });
        // console.log('=====storeBrands', storeBrands)
        // set the state and sort barnds alphabetically
        setProductBrands(storeBrands.sort((a, b) => a.localeCompare(b)));
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError('Failed to load brands');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // handle to get size of the window to display mobile menu or desktop menu  
  useEffect(() => {
    // This code runs only on the client side   
    const handleResize = () => {
      setIsDesktopView(!(window.innerWidth < 768)); // FALSE if width < 768
      // setIsViewPortSmall(!(window.innerWidth < 768));
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

  // Handle display Hamburger dropdown  
  const toggleMenu = () => {
    setIsOpen(prev => !prev); // toggle hamburger button
    setActiveIndex(null); // reset/close hamburger content or menu content.
  };

  // Handle closing menu dropdown when use click outside of it's box.
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (hamburgerRef.current && !hamburgerRef.current.contains(e.target) && dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false); // close the hamburger         
        setActiveIndex(null); // close hamburger content or menu content.
      }
    };
    // Handle close the dropdown on route change
    const handleRouteChange = () => {
      setIsOpen(false); // Close the dropdown on route change
      setActiveIndex(null); // close hamburger content or menu content.
    };
    document.addEventListener('mousedown', handleClickOutside);
    // What router.events.on() does is, it adds a listener for a specific routing event in Next.js. 
    router.events.on('routeChangeStart', handleRouteChange);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      // What router.events.off() does is, it removes/(unsubscribes) the listener you added with router.events.on().
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [router]);
  // Handle toggle dropdown menu content
  const toggleMenuContent = (index: string) => {
    setActiveIndex(activeIndex === index ? null : index); // 
    // setIsHidden(prevState => !prevState);   
  };
  // next up: when dropdown menu is displayed and its content is click, we should add focus to ul that is dispayed(Mens, Womens or Brands) when clicked focus on it
  return (
    <>
      {isDesktopView ? (
        // <div className="hidden  md:block lg:block p-2 h-10 border-b">
        <div className="block p-2 h-10 border-b">
          <ul className="flex ">
            {/* <li className="inline ml-4 mr-16 w-20"><Link href={'/'}>Home</Link></li> */}
            <li className="inline ml-4 mr-16 w-14 hover:border-t-2 border-slate-400"><Link href={'/menu/newItems'}>New In</Link></li>
            <li className="inline mr-16 group  w-12 hover:border-t-2 border-slate-400">
              <span className="">Men's</span>
              {/* <ul className="hidden group-hover:block group-hover:relative bg-slate-200"> */}
              <ul className="hidden group-hover:block group-hover:relative bg-white w-48  z-10 top-1.5 p-2 border rounded text-sm">
                <p className="font-bold text-lg mb-2">Shop by Category</p>
                {globalMenCategories.map((elem, index) => (
                  <li key={index} className="m-1 hover:text-slate-400">
                    <Link href={'/menu/' + 'm' + elem.toLowerCase()}> {elem}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            <li className="inline mr-16 group  w-16  border-slate-400 ">
              <span>Women's</span>
              <ul className="hidden group-hover:block group-hover:relative  bg-white w-48 z-10 top-1.5 p-2 border rounded text-sm">
                <p className="font-bold text-lg mb-2">Shop by Category</p>
                {globalWomenCategories.map((elem, index) => (
                  <li key={index} className="m-1 hover:text-slate-400">
                    <Link href={'/menu/' + 'w' + elem.toLowerCase()}> {elem}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            <li className="inline mr-16 group  w-12 hover:border-t-2 border-slate-400">
              <span>Brands</span>
              {/* <ul className=" group-hover:block group-hover:relative bg-white w-48  z-10 top-1.5 p-2 border rounded relative">
              <p className="font-bold text-lg mb-2">Shop by Brand</p>
              {globalBrands.map((elem, index) => (
                <li key={index} className="  m-1 hover:text-slate-400">
                  <Link href={'/menu/' + elem}>M {elem}
                  </Link>
                </li>
              ))}
            </ul> */}
              <div className={`hidden group-hover:block group-hover:relative flex-col bg-white ${secondColumn.length > 0 ? 'w-80' : 'w-48'}  z-10 top-1.5 p-2 border rounded text-sm`}  >
                <p className="font-bold text-lg mb-2">Shop by Brand</p>
                <div className="flex gap-4">
                  {loading && <p className="text-sm text-gray-500">Loading...</p>}
                  {error && <p className="text-sm text-red-500">{error}</p>}
                  {!loading && !error && (
                    <>
                      <ul>
                        {firstColumn.map((elem, index) => (
                          <li key={index} className="m-1 hover:text-slate-400">
                            <Link href={`/menu/${encodeURIComponent(elem.trim())}`}>{elem}</Link>
                          </li>
                        ))}
                      </ul>
                      {secondColumn.length > 0 && (
                        <ul>
                          {secondColumn.map((elem, index) => (
                            <li key={index} className="m-1 hover:text-slate-400">
                              <Link href={`/menu/${encodeURIComponent(elem.trim())}`}>{elem}</Link>
                            </li>
                          ))}
                          {globalBrands.length > 15 && (
                            <li className="m-1 hover:text-slate-400" >More Brands...</li>
                          )}
                        </ul>
                      )}
                    </>
                  )}
                </div>
              </div>
            </li>
          </ul>
        </div>

      ) : (
        <div className='menuContainer  block   '>
          <div className='menuButton' ref={hamburgerRef} onClick={toggleMenu}>

            <div className={`bar ${isOpen ? 'open1' : ''}`} />

            <div className={`bar ${isOpen ? 'open2' : ''}`} />

            <div className={`bar ${isOpen ? 'open3' : ''}`} />
          </div>

          {isOpen && (

            <ul className='dropdownMenu' ref={dropdownRef}>
              <li>
                <Link href={`/menu/}`}>New In</Link>
              </li>
              <li className="border-t " onClick={() => toggleMenuContent('Mens')}>
                <span className="">Men's</span>
                <span className="toggleIcon float-right  text-2xl leading-6 ">{activeIndex === 'Mens' ? '−' : '+'}</span>
                {/* <Link href={`/menu/}`}>Mens</Link> */}
                {/* <ul className="hidden group-hover:block group-hover:relative  bg-white w-48 z-10 top-1.5 p-2 border rounded text-sm"> */}
                <ul className={`${activeIndex === 'Mens' ? ' ' : "hidden"}  bg-white w-48 z-10 top-1.5 p-2 border rounded text-sm`}>
                  {globalMenCategories.map((elem, index) => (
                    <li key={index} className="m-1 hover:text-slate-400">
                      <Link href={'/menu/' + 'm' + elem.toLowerCase()}> {elem}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li className="border-t " onClick={() => toggleMenuContent('Womens')}>
                <span>Women's</span>
                <span className="toggleIcon float-right text-2xl leading-6 ">{activeIndex === 'Womens' ? '−' : '+'}</span>
                {/* <Link href={`/menu/}`}>Women's</Link> */}
                {/* <ul className="hidden group-hover:block group-hover:relative  bg-white w-48 z-10 top-1.5 p-2 border rounded text-sm"> */}
                <ul className={`${activeIndex === 'Womens' ? ' ' : "hidden"}  bg-white w-48 z-10 top-1.5 p-2 border rounded text-sm`}>

                  {globalWomenCategories.map((elem, index) => (
                    <li key={index} className="m-1 hover:text-slate-400">
                      <Link href={'/menu/' + 'w' + elem.toLowerCase()}> {elem}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li className="border-t " onClick={() => toggleMenuContent('Brands')}>
                <span>Brands</span>
                <span className="toggleIcon float-right text-2xl leading-6 ">{activeIndex === 'Brands' ? '−' : '+'}</span>
                {/* <ul className="hidden group-hover:block group-hover:relative  bg-white w-48 z-10 top-1.5 p-2 border rounded text-sm"> */}
                <ul className={`${activeIndex === 'Brands' ? ' ' : "hidden"}  bg-white w-48 z-10 top-1.5 p-2 border rounded text-sm`}>

                  {productBrands.map((elem, index) => (
                    <li key={index} className="m-1 hover:text-slate-400">
                      <Link href={'/menu/' + 'm' + elem.toLowerCase()}> {elem}
                      </Link>
                    </li>
                  ))}
                </ul>
                {/* <Link href={`/menu/}`}>Brands</Link> */}
              </li>
            </ul>
            // <div className='dropdownMenu'>
            //   <a href="#">Home</a>
            //   <a href="#">About</a>
            //   <a href="#">Services</a>
            //   <a href="#">Contact</a>
            // </div>
          )}
        </div>
      )}
    </>
  )

}
export default MenuBar;