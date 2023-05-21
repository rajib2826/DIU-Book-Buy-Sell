import React, { useEffect, useState } from 'react';
import {
  deleteDoc,
  doc,
  collection,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore';
import Footer from '../components/Layout/Footer';
import Navbar from '../components/Layout/Navbar';
import Post from './Post';
import { useAuth } from '../components/Auth/AuthContext';
import { db } from '../firebaseConfig';
import { toast } from 'react-hot-toast';

const Listing = () => {
  const { loggedInUser } = useAuth();
  const [postOpen, setPostOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userBooks, setUserBooks] = useState([]);
  const [bookDetails, setBookDetails] = useState({});

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // get users books listing
  useEffect(() => {
    if (loggedInUser) {
      setLoading(true);
      const unsubscribe = onSnapshot(
        query(
          collection(db, 'books'),
          where('sellerEmail', '==', loggedInUser?.email)
        ),
        (snapshot) => {
          const userBooks = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setUserBooks(userBooks);
          setLoading(false);
        },
        (err) => {
          setLoading(false);
          toast.error(err.message);
        }
      );
      return () => unsubscribe();
    }
  }, [loggedInUser]);

  const handleDelete = async (listingId) => {
    if (!window.confirm('Are you sure you want to delete this listing?'))
      return;

    try {
      await deleteDoc(doc(db, 'books', listingId));
      toast.success('Book listing deleted successfully');
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      {/* Post Modal */}
      <Post open={postOpen} setOpen={setPostOpen} bookDetails={bookDetails} />

      <Navbar />
      <div className='bg-white'>
        <div className='mx-auto max-w-7xl pt-10 pb-16 px-4 sm:px-6 lg:px-8'>
          <div className='px-4 sm:px-6 lg:px-8'>
            <div className='sm:flex sm:items-center'>
              <div className='sm:flex-auto'>
                <h1 className='text-2xl font-semibold text-gray-900'>
                  Listing
                </h1>
                <p className='mt-2 text-sm text-gray-700'>
                  A list of all the users in your books including their name,
                  title, email and price.
                </p>
              </div>
              <div className='mt-4 sm:mt-0 sm:ml-16 sm:flex-none'>
                <button
                  type='button'
                  onClick={() => {
                    setBookDetails({});
                    setPostOpen(true);
                  }}
                  className='inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto'
                >
                  Add books
                </button>
              </div>
            </div>
            <div className='mt-8 flex flex-col'>
              <div className='-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8'>
                <div className='inline-block min-w-full py-2 align-middle md:px-6 lg:px-8'>
                  <div className='overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg'>
                    <table className='min-w-full divide-y divide-gray-300'>
                      <thead className='bg-gray-50'>
                        <tr>
                          <th
                            scope='col'
                            className='py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6'
                          >
                            Name
                          </th>
                          <th
                            scope='col'
                            className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'
                          >
                            Category
                          </th>
                          <th
                            scope='col'
                            className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'
                          >
                            Quantity
                          </th>
                          <th
                            scope='col'
                            className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'
                          >
                            Status
                          </th>
                          <th
                            scope='col'
                            className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'
                          >
                            Price
                          </th>
                          <th
                            scope='col'
                            className='relative py-3.5 pl-3 pr-4 sm:pr-6'
                          >
                            <span className='sr-only'>Action</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className='divide-y divide-gray-200 bg-white'>
                        {loading && (
                          <tr>
                            <td className='whitespace-nowrap py-4'>
                              <div className='flex items-center'>
                                <img
                                  className='w-16 ml-8'
                                  src='https://media.tenor.com/On7kvXhzml4AAAAj/loading-gif.gif'
                                  alt=''
                                />
                              </div>
                            </td>
                          </tr>
                        )}

                        {!loading &&
                          userBooks?.length > 0 &&
                          userBooks?.map((item) => (
                            <tr key={item?.listingId}>
                              <td className='whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6'>
                                <div className='flex items-center'>
                                  <div className='h-10 w-10 flex-shrink-0'>
                                    <img
                                      className='h-10 w-10 rounded-lg'
                                      src={item?.bookCover}
                                      alt=''
                                    />
                                  </div>
                                  <div className='ml-4'>
                                    <div className='font-medium text-gray-900'>
                                      {item?.name}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
                                <div className='text-gray-900'>
                                  {item?.sellerDepartment}
                                </div>
                              </td>
                              <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
                                <div className='text-gray-900'>
                                  {item?.quantity}
                                </div>
                              </td>
                              <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
                                <span
                                  className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                                    item?.available
                                      ? 'text-green-800 bg-green-100'
                                      : 'text-red-600 bg-red-50'
                                  } `}
                                >
                                  {item?.available
                                    ? 'In Stock'
                                    : 'Out of Stock'}
                                </span>
                              </td>
                              <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-600'>
                                {item?.sellingPrice}
                              </td>
                              <td className='relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6'>
                                <button
                                  type='button'
                                  onClick={() => {
                                    setBookDetails(item);
                                    setPostOpen(true);
                                  }}
                                  className='text-indigo-600 hover:text-indigo-900'
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDelete(item?.listingId)}
                                  type='button'
                                  className='ml-6 text-red-800 hover:text-red-900'
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}

                        {!loading && userBooks?.length === 0 && (
                          <tr>
                            <td className='whitespace-nowrap py-4 pl-4 pr-3'>
                              <div className='flex items-center'>
                                <div className='font-medium text-md text-gray-900'>
                                  No books found
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Listing;
