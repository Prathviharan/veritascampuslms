import React from "react";

export default function Settings() {
  return (
    <div>
      <div>
        <h1 className="font-bold text-2xl">Admin Account Settings</h1>
        <form action="">
          <div class="grid gap-6 mb-6 md:grid-cols-4 mt-5">
            <div>
              <label
                for="first_name"
                class="block mb-2 text-sm font-medium text-gray-900 "
              >
                Username
              </label>
              <input
                type="text"
                id="first_name"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                placeholder="John@12"
                required
              />
            </div>
            <div>
              <label
                for="last_name"
                class="block mb-2 text-sm font-medium text-gray-900 "
              >
                Password
              </label>
              <input
                type="text"
                id="last_name"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                placeholder="**********"
                required
              />
            </div>
          </div>

          <div className="flex ">
            <button
              type="button"
              class="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 "
            >
              Save
            </button>
            <button
              type="button"
              class="text-white bg-gray-400 hover:bg-gray-600 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 "
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      <section className="mt-8">
        <h1 className="font-bold text-2xl">Notification Preferences</h1>

        <div className="flex flex-col mt-4 w-36">
          <label class="inline-flex items-center mb-5 cursor-pointer mt-4">
            <span class="ms-3 text-sm font-medium text-gray-900 mr-5">
              Setting
            </span>
            <input type="checkbox" value="" class="sr-only peer" />
            <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all  peer-checked:bg-blue-600 "></div>
          </label>
          <label class="inline-flex items-center mb-5 cursor-pointer mt-4">
            <span class="ms-3 text-sm font-medium text-gray-900 mr-5">
              Setting
            </span>
            <input type="checkbox" value="" class="sr-only peer" />
            <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all  peer-checked:bg-blue-600 "></div>
          </label>
          <label class="inline-flex items-center mb-5 cursor-pointer mt-4">
            <span class="ms-3 text-sm font-medium text-gray-900 mr-5">
              Setting
            </span>
            <input type="checkbox" value="" class="sr-only peer" />
            <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all  peer-checked:bg-blue-600 "></div>
          </label>
        </div>
      </section>

      <section className="mt-5">
        <h1 className="font-bold text-2xl">System Wide Rules</h1>

        <div class="grid gap-6 mb-6 md:grid-cols-3 mt-5">
          <div className="flex flex-col md:flex-row md:justify-center md:items-center md:gap-5">
            <label
              for="first_name"
              class="block mb-2 text-sm font-medium text-gray-900 w-44"
            >
              Password Policy
            </label>
            <input
              type="text"
              id="first_name"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
              required
            />
          </div>
        </div>

        <div class="grid gap-6 mb-6 md:grid-cols-3 mt-5">
          <div className="flex flex-col md:flex-row md:justify-center md:items-center md:gap-5">
            <label
              for="countries"
              class="block mb-2 text-sm font-medium text-gray-900 w-44"
            >
              Access Levels
            </label>
            <select
              id="level"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
            >
              <option selected>Choose a Level</option>
              <option value="admin">Admin</option>
              <option value="editor">Editor</option>
              <option value="lecture">Lecture</option>
            </select>
          </div>
        </div>
      </section>

      <section className="mt-5">
        <h1 className="font-bold text-2xl">API Intergration</h1>
        <div class="grid gap-6 mb-6 md:grid-cols-3 mt-5">
          <div className="flex flex-col md:flex-row md:justify-center md:items-center md:gap-5">
            <label
              for="first_name"
              class="block mb-2 text-sm font-medium text-gray-900 w-44"
            >
              API Key
            </label>
            <input
              type="text"
              id="first_name"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
              required
            />
          </div>
        </div>
        <div class="grid gap-6 mb-6 md:grid-cols-3 mt-5">
          <div className="flex flex-col md:flex-row md:justify-center md:items-center md:gap-5">
            <label
              for="first_name"
              class="block mb-2 text-sm font-medium text-gray-900 w-44"
            >
              Email
            </label>
            <input
              type="text"
              id="first_name"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
              required
            />
          </div>
        </div>
        <div class="grid gap-6 mb-6 md:grid-cols-3 mt-5">
          <div className="flex flex-col md:flex-row md:justify-center md:items-center md:gap-5">
            <label
              for="first_name"
              class="block mb-2 text-sm font-medium text-gray-900 w-44"
            >
              Payment System
            </label>
            <input
              type="text"
              id="first_name"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
              required
            />
          </div>
        </div>
        <div className="flex ">
          <button
            type="button"
            class="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 "
          >
            Save API
          </button>
        </div>
      </section>
    </div>
  );
}
