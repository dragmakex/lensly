Follow the following instructions very thoroughly. You are an expert frontend designer and engineer. You have years of experience with React, Next.js, Typescript, Tailwind CSS, HTML, CSS, Vercel and ShadCN. You have implemented many Figma designs and understand all the intricacies of implementing a design into a Farcaster Miniapp (which essentially is a website with some few added files). 

Make sure to implement everything in dark mode.

ALWAYS USE BUN!

For our product make sure to read the files in the ../docs/ folder and in general make sure to understand the full repository that you can find under ../. These are the docs for our product that define everything you need to understand.    

Always use best practices and industry standards. Make sure to modularize your code and always create new files for components and then resuse them as much as possible with certain small adjustments that need to be made. I want the repository to be as clean as possible.

I need you to use Apple's Liquid Glass design for our analytics miniapp. Here are some examples of liquid glass components that we will use. I have this Liquid-glass built using the David UI Tailwind CSS Library by Creative Tim. Integrate the components in my project, but make sure to only implement them if they suit our usecase. For now we might not need some of the components, but once you see an usecase where you might need one of them make sure to implement it. Even if you don't directly use these components make sure to ALWAYS use the same design. Also make sure ifpossible to integrate ShadCN. We can perhaps reuse the components, but then reuse the design of the Liquid Glass. There are more details on the Framework Documentation at https://www.creative-tim.com/david-ui/docs/html/liquid-glass:

Search Bar Component Code:
```html

          <div class="flex items-center justify-center w-screen min-h-[400px] bg-cover bg-center bg-no-repeat rounded-md" style="background-image: url('https://images.unsplash.com/photo-1630061937831-5b8bc0a58548?w=800&auto=format&fit=crop&q=90');">
            <div class="relative w-80">
              <input type="text" placeholder="Search anything..." class="pl-8 pr-4 py-2 w-full text-white text-sm bg-black/20 border border-white/50 backdrop-blur-sm rounded-full shadow-[inset_0_1px_0px_rgba(255,255,255,0.75),0_0_9px_rgba(0,0,0,0.2),0_3px_8px_rgba(0,0,0,0.15)] placeholder:text-white/70 focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-300 relative before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-br before:from-white/60 before:via-transparent before:to-transparent before:opacity-70 before:pointer-events-none after:absolute after:inset-0 before:rounded-lg after:bg-gradient-to-tl after:from-white/30 after:via-transparent after:to-transparent after:opacity-50 after:pointer-events-none" />
              <div class="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-4">
                  <path fill-rule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clip-rule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        
```
Generic Long Card Component Code:
```html

         <div class="flex items-center justify-center w-screen min-h-[400px] bg-cover bg-center bg-no-repeat rounded-md" style="background-image: url('https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800&auto=format&fit=crop&q=90');">
            <div class="max-w-md bg-black/20 backdrop-blur-sm border border-white/50 rounded-lg shadow-[inset_0_1px_0px_rgba(255,255,255,0.75),0_0_9px_rgba(0,0,0,0.2),0_3px_8px_rgba(0,0,0,0.15)] p-6 text-white relative before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-br before:from-white/60 before:via-transparent before:to-transparent before:opacity-70 before:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:bg-gradient-to-tl after:from-white/30 after:via-transparent after:to-transparent after:opacity-50 after:pointer-events-none">
              <div class="relative z-10">
                <h3 class="text-xl font-semibold mb-3">Liquid Glass Card</h3>
                <p class="text-sm opacity-90 mb-4">This is a beautiful Liquid Glass card with backdrop blur and translucent effects.</p>
                <button class="inline-flex items-center justify-center px-4 py-2 text-white text-sm font-medium rounded-lg bg-white/20 border border-white/30 backdrop-blur-sm hover:bg-white/30 transition-all duration-300">
                  Learn More
                </button>
              </div>
            </div>
          </div>
      
```

Generic 2 Card Component Code:
```html

          <div class="flex items-center justify-center w-screen min-h-[400px] bg-cover bg-center bg-no-repeat rounded-lg" style="background-image: url('https://images.unsplash.com/photo-1683802175911-464278f124aa?w=800&auto=format&fit=crop&q=90');">
            <div class="flex gap-4 rounded-lg">
              <div class="relative p-6 text-white bg-black/20 backdrop-blur-sm border border-white/50 rounded-lg shadow-[inset_0_1px_0px_rgba(255,255,255,0.75),0_0_9px_rgba(0,0,0,0.2),0_3px_8px_rgba(0,0,0,0.15)] hover:bg-white/30 transition-all duration-300 before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-br before:from-white/60 before:via-transparent before:to-transparent before:opacity-70 before:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:bg-gradient-to-tl after:from-white/30 after:via-transparent after:to-transparent after:opacity-50 after:pointer-events-none">
                <div class="flex items-center gap-2 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                    <path d="M11.7 2.805a.75.75 0 0 1 .6 0A60.65 60.65 0 0 1 22.83 8.72a.75.75 0 0 1-.231 1.337 49.948 49.948 0 0 0-9.902 3.912l-.003.002c-.114.06-.227.119-.34.18a.75.75 0 0 1-.707 0A50.88 50.88 0 0 0 7.5 12.173v-.224c0-.131.067-.248.172-.311a54.615 54.615 0 0 1 4.653-2.52.75.75 0 0 0-.65-1.352 56.123 56.123 0 0 0-4.78 2.589 1.858 1.858 0 0 0-.859 1.228 49.803 49.803 0 0 0-4.634-1.527.75.75 0 0 1-.231-1.337A60.653 60.653 0 0 1 11.7 2.805Z" />
                    <path d="M13.06 15.473a48.45 48.45 0 0 1 7.666-3.282c.134 1.414.22 2.843.255 4.284a.75.75 0 0 1-.46.711 47.87 47.87 0 0 0-8.105 4.342.75.75 0 0 1-.832 0 47.87 47.87 0 0 0-8.104-4.342.75.75 0 0 1-.461-.71c.035-1.442.121-2.87.255-4.286.921.304 1.83.634 2.726.99v1.27a1.5 1.5 0 0 0-.14 2.508c-.09.38-.222.753-.397 1.11.452.213.901.434 1.346.66a6.727 6.727 0 0 0 .551-1.607 1.5 1.5 0 0 0 .14-2.67v-.645a48.549 48.549 0 0 1 3.44 1.667 2.25 2.25 0 0 0 2.12 0Z" />
                  </svg>
                  <h3 class="text-lg font-semibold">Premium Features</h3>
                </div>
                <p class="text-sm opacity-90">Unlock advanced analytics and AI-powered insights to boost your productivity and streamline workflows.</p>
              </div>
              <div class="relative p-6 text-white bg-black/20 backdrop-blur-sm border border-white/50 rounded-lg shadow-[inset_0_1px_0px_rgba(255,255,255,0.75),0_0_9px_rgba(0,0,0,0.2),0_3px_8px_rgba(0,0,0,0.15)] hover:bg-white/30 transition-all duration-300 before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-br before:from-white/60 before:via-transparent before:to-transparent before:opacity-70 before:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:bg-gradient-to-tl after:from-white/30 after:via-transparent after:to-transparent after:opacity-50 after:pointer-events-none">
                <div class="flex items-center gap-2 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                    <path fill-rule="evenodd" d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813A3.75 3.75 0 0 0 7.466 7.89l.813-2.846A.75.75 0 0 1 9 4.5ZM18 1.5a.75.75 0 0 1 .728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 0 1 0 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 0 1-1.456 0l-.258-1.036a2.625 2.625 0 0 0-1.91-1.91l-1.036-.258a.75.75 0 0 1 0-1.456l1.036-.258a2.625 2.625 0 0 0 1.91-1.91l.258-1.036A.75.75 0 0 1 18 1.5ZM16.5 15a.75.75 0 0 1 .712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 0 1 0 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 0 1-1.422 0l-.395-1.183a1.5 1.5 0 0 0-.948-.948l-1.183-.395a.75.75 0 0 1 0-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0 1 16.5 15Z" clip-rule="evenodd" />
                  </svg>
                  <h3 class="text-lg font-semibold">AI Assistant</h3>
                </div>
                <p class="text-sm opacity-90">Experience intelligent automation with our cutting-edge AI that adapts to your workflow and preferences.</p>
              </div>
            </div>
          </div>
        
```

Button Component Code:
```html

        <div class="flex items-center justify-center w-screen min-h-[400px] bg-cover bg-center bg-no-repeat rounded-md" style="background-image: url('https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800&auto=format&fit=crop&q=90');">
          <button class="inline-flex items-center justify-center border align-middle select-none font-sans font-medium text-center px-4 py-2 text-white text-sm font-medium rounded-lg bg-white/2.5 border border-white/50 backdrop-blur-sm shadow-[inset_0_1px_0px_rgba(255,255,255,0.75),0_0_9px_rgba(0,0,0,0.2),0_3px_8px_rgba(0,0,0,0.15)] hover:bg-white/30 transition-all duration-300 before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-br before:from-white/60 before:via-transparent before:to-transparent before:opacity-70 before:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:bg-gradient-to-tl after:from-white/30 after:via-transparent after:to-transparent after:opacity-50 after:pointer-events-none transition antialiased">Button</button>
        </div>
      
```

Big Generic Card Component Code:
```html

          <div class="flex items-center justify-center w-screen min-h-[400px] bg-cover bg-center bg-no-repeat rounded-md" style="background-image: url('https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800&auto=format&fit=crop&q=90');">
            <div class="max-w-sm bg-black/20 backdrop-blur-sm border border-white/50 rounded-lg shadow-[inset_0_1px_0px_rgba(255,255,255,0.75),0_0_9px_rgba(0,0,0,0.2),0_3px_8px_rgba(0,0,0,0.15)] p-6 text-white relative before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-br before:from-white/60 before:via-transparent before:to-transparent before:opacity-70 before:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:bg-gradient-to-tl after:from-white/30 after:via-transparent after:to-transparent after:opacity-50 after:pointer-events-none">
              <div class="relative z-10">
                <div class="flex flex-col items-center text-center">
                  <div class="w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8 text-white">
                      <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                    </svg>
                  </div>
                  <h3 class="text-lg font-semibold mb-2">Premium Features</h3>
                  <p class="text-sm opacity-90 mb-4 leading-relaxed">Unlock advanced capabilities with our premium tier. Get access to exclusive tools and enhanced performance.</p>
                  <div class="flex gap-2">
                    <button class="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-all duration-300 border border-white/30">
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        
```


Generic 3 Card Component Code:
```html

          <div class="flex items-center justify-center w-screen min-h-[400px] bg-cover bg-center bg-no-repeat rounded-md" style="background-image: url('https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800&auto=format&fit=crop&q=90');">
            <div class="flex gap-4 max-w-4xl w-full px-4">
              <!-- Left Card -->
              <div class="flex-1 bg-black/20 backdrop-blur-sm border border-white/50 rounded-lg shadow-[inset_0_1px_0px_rgba(255,255,255,0.75),0_0_9px_rgba(0,0,0,0.2),0_3px_8px_rgba(0,0,0,0.15)] p-4 text-white relative before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-br before:from-white/60 before:via-transparent before:to-transparent before:opacity-70 before:pointer-events-none after:absolute after:inset-0 before:rounded-lg after:bg-gradient-to-tl after:from-white/30 after:via-transparent after:to-transparent after:opacity-50 after:pointer-events-none">
                <div class="relative z-10">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center border border-white/30">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                        <path fill-rule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 class="text-sm font-semibold">Central Park</h3>
                      <p class="text-xs opacity-60">New York, NY</p>
                    </div>
                  </div>
                  <p class="text-xs opacity-70 mt-3">843 acres of green space in the heart of Manhattan, featuring lakes, meadows, walking paths, recreational facilities, and countless opportunities for outdoor activities.</p>
                </div>
              </div>
              
              <!-- Right Column with 2 Cards -->
              <div class="flex-1 flex flex-col gap-4">
                <!-- Top Right Card -->
                <div class="bg-black/20 backdrop-blur-sm border border-white/50 rounded-lg shadow-[inset_0_1px_0px_rgba(255,255,255,0.75),0_0_9px_rgba(0,0,0,0.2),0_3px_8px_rgba(0,0,0,0.15)] p-4 text-white relative before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-br before:from-white/60 before:via-transparent before:to-transparent before:opacity-70 before:pointer-events-none after:absolute after:inset-0 before:rounded-lg after:bg-gradient-to-tl after:from-white/30 after:via-transparent after:to-transparent after:opacity-50 after:pointer-events-none">
                  <div class="relative z-10">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center border border-white/30">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                      </div>
                      <div>
                        <h3 class="text-sm font-semibold">Times Square</h3>
                        <p class="text-xs opacity-60">Tourist attraction</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Bottom Right Card -->
                <div class="bg-black/20 backdrop-blur-sm border border-white/50 rounded-lg shadow-[inset_0_1px_0px_rgba(255,255,255,0.75),0_0_9px_rgba(0,0,0,0.2),0_3px_8px_rgba(0,0,0,0.15)] p-4 text-white relative before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-br before:from-white/60 before:via-transparent before:to-transparent before:opacity-70 before:pointer-events-none after:absolute after:inset-0 before:rounded-lg after:bg-gradient-to-tl after:from-white/30 after:via-transparent after:to-transparent after:opacity-50 after:pointer-events-none">
                  <div class="relative z-10">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center border border-white/30">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                          <path d="M8 2v2H6c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-2V2h-2v2H10V2H8zm10 16H6V9h12v9z"/>
                        </svg>
                      </div>
                      <div>
                        <h3 class="text-sm font-semibold">Brooklyn Bridge</h3>
                        <p class="text-xs opacity-60">Historic landmark</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        
```

For all Farcaster related tasks make sure to use the docs that can you can find here: https://dtech.vision/farcaster/miniapps/. Here is how you turn a normal website into a Farcaster miniapp:

import {
  Aside,
  LinkButton,
  Steps,
  Tabs,
  TabItem,
} from "@astrojs/starlight/components";
import AllPackageManagers from "@/components/AllPackageManagers.astro"

> We assume you are familiar with what a [Farcaster Mini App](/farcaster/miniapps/) is. Additionally nothing more then minimal frontend development experience is assumed, we'll go through each individual step.

## Make the website render large with custom preview and action buttons

We can have our website render as a Farcaster Mini App, so it shows up with our own big preview image and call to action button.
The button will open a webpage in app, so we can use this either to show the URL shared or use it as call to action for marketing or lead generation.

A pure HTML simplest Mini App Github Repo to see it all tied together is available [here](https://github.com/dtechvision/simplest-farcaster-frame).

To achieve our website being embedded into Farcaster client's like Warpcast nicely follow these steps

<Steps>

1. **Provide the metadata about the app/website in the HTML metadata:**

   The Mini App metadata is typed in JSON which we will fill in with our information.
   Please ensure the following properties about your metadata

   - imageUrl image is 3:2 format less than 10mb in size
   - the title as well as name are less than 32 characters
   - the splashImageUrl must be 200x200px and less than 1MB

   The full type specification can be found in the [Mini App specification](https://github.com/farcasterxyz/protocol/discussions/205)

   The metadata JSON looks as follows:

   ```json
   {
     "version": "next",
     "imageUrl": "https://dtech.vision/frame-thumbnail.png",
     "button": {
       "title": "Learn Farcaster",
       "action": {
         "type": "launch_frame",
         "name": "dTech - Farcaster Boutique",
         "url": "https://dtech.vision/farcaster/",
         "splashImageUrl": "https://dtech.vision/icon.png",
         "splashBackgroundColor": "#f7f7f7"
       }
     }
   }
   ```

   The valid JSON is added to the HTML head section ( in Javascript/Typescript you may define it as a variable and then use JSON.stringify ).

   ```html
   <meta
     property="fc:frame"
     content="<Insert metadata JSON here. Ensure it's valid JSON!>"
   />
   ```

2. **Add a .well-known/farcaster.json file to your website**

   To generate the accountAssociation we will use the **Warpcast mobile app** (though if you have a valid signer you could also do this on your own)

   > NOTE: Make sure you're in the mobile app!

   In Warpcast navigate to `Settings > Developer > Domains` where you can type in your domain e.g. _dtech.vision_ to generate the domain manifest.
   If you don't see the Developer menu, you may need to scroll down or go to `Settings > Advanced > scroll down and enable Developer mode`.

   Clicking generate domain manifest will give use the accountAssociation section and potentially a sample mini app section we can paste and adjust to our needs.
   One such sample is as follows:

   ```json
   {
     "accountAssociation": {
       "header": "",
       "payload": "",
       "signature": ""
     },
     "frame": {
       "name": "dTech - Farcaster docs",
       "version": "0.0.1",
       "iconUrl": "https://dtech.vision/icon.png",
       "homeUrl": "https://dtech.vision/farcaster",
       "splashImageUrl": "https://dtech.vision/icon.png",
       "splashBackgroundColor": "#f7f7f7",
       "webhookUrl": "https://dtech.vision/webhookurl"
     }
   }
   ```

3. **Call the mini app SDK's ready() function to hide the loading screen**

   The mini app SDK will show a loading screen until the mini app is ready to be displayed. To hide this loading screen, call the `ready()` function.
   To get there we need to use the Farcaster Mini App SDK. If we have a Typescript (or JS) project we can install and import the [SDK](https://www.npmjs.com/package/@farcaster/miniapp-sdk).
   In case we don't, we can **embed the script directly**:

   ```html
   <script src="https://cdn.jsdelivr.net/npm/@farcaster/miniapp-sdk/dist/index.min.js"></script>
   <script>
     frame.sdk.actions.ready();
   </script>
   ```

   now that ready is called, the loading screen will be hidden and your webpage accessible via Farcaster Mini App - your done!

   For **users of Typescript** (or JS) we install the mini app sdk

   <AllPackageManagers pkg="@farcaster/miniapp-sdk" />

   now on our page we call the ready function. The following is a simplified visualisation of a Hello World page, adapt this to your application.

   ```typescript
   import sdk from "@farcaster/miniapp-sdk";

   export function Home() {
     sdk.actions.ready();

     return <div>Hello from dTech!</div>;
   }
   ```

   Try loading your website as Mini App in the [developer playground](https://farcaster.xyz/~/developers/frames) after deploying it.

   A more robust useEffect based setup that most React developers will be familiar with is as follows for you Index page:

   ```typescript
   import type { Context } from '@farcaster/miniapp-core';

   export default function Index() {
     const [isSDKLoaded, setIsSDKLoaded] = useState(false);
     const [context, setContext] = useState<Context.FrameContext>();

     // Farcaster Mini App Integration (see https://dtech.vision/farcaster/)
     useEffect(() => {
       const load = async () => {
         setContext(await sdk.context);
         sdk.actions.ready();
       };
       if (sdk && !isSDKLoaded) {
         setIsSDKLoaded(true);
         load();
       }
     }, [isSDKLoaded]);
     // end Farcaster Mini App Integration

     return <div>Hello from dTech!</div>;
   }
   ```

   In the above sample we're using the Mini App context and setting it too! It's powerful data tracking where the Mini App was opened from
   and which user opened it, what post they saw or if they clicked on a notification and more.

</Steps>

<Aside>
  Putting it all together you can have a pure HTML Farcaster Mini App! They are
  websites after all! How cool is that!? The following
  [Github](https://github.com/dtechvision/simplest-farcaster-frame) is the
  simplest Mini App you can build and since it's HTML AI can help you customize it
  easily!
</Aside>

Did you know you can also take that HTML and throw it into a code widget? you maybe able to turn your web2 stack into a mini app with it!

<LinkButton
  href="https://github.com/dtechvision/simplest-farcaster-frame"
  variant="secondary"
  icon="external"
  iconPlacement="start"
  target="_blank"
>
  A pure HTML simplest Mini App Github Repo
</LinkButton>

Here are more resources that might be of help when implementing a Farcaster miniapp:
- https://dtech.vision/farcaster/miniapps/
- https://github.com/dtechvision/prof-huyang

ULTRATHINK!
