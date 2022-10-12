import { Fragment, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const options = [
    { 
        name: 'Choose Sorting Criteria',
        data: null
    },
    { 
        name: 'Sort By Date Added',
        data: 'submissionDate' 
    },
    { 
        name: 'Sort By Date Published',
        data: 'publishDate' 
    }
]

export default function SortDropDown() {
  const [selected, setSelected] = useState(options[0])

  const changeSort = (selected: any) => {
    let container = document.querySelector('#results');
    if (selected.data !== null && container) {
        let elements = Array.from(container.children); 
        let sorted = elements.sort(function(a, b){
            const aElem = a as HTMLElement;
            const bElem = b as HTMLElement;
            const stringA = aElem.dataset[selected.data];
            const stringB = bElem.dataset[selected.data];
            if (stringA && stringB) {
                let dateA = new Date(stringA);
                let dateB = new Date(stringB);
                return dateB.getTime() - dateA.getTime()
            }
            return 0;
        });
        container.innerHTML = '';
        sorted.forEach(elm => container?.append(elm));
    }
  };

  changeSort(selected);

  return (
    <div className="top-16 w-60" id="sortBox">
      <Listbox value={selected} onChange={setSelected}>
        <div className="relative mt-1">
          <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white dark:text-black py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
            <span className="block truncate">{selected.name}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ExpandMoreIcon/>
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {options.map((option, optionIdx) => (
                <Listbox.Option
                  key={optionIdx}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 px-4 ${
                      active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                    }`
                  }
                  value={option}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? 'font-medium' : 'font-normal'
                        }`}
                      >
                        {option.name}
                      </span>
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  )
}
