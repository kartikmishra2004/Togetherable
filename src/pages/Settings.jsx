import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom';
import { useFirebase } from '../context/firebase';
import { useScript } from '../context/TTScontext';

const Settings = () => {

  const { user, loading } = useFirebase();
  const { isScriptAdded, toggleScript } = useScript();

  const [settings, setSettings] = useState({
    notifications: true,
    voiceCommands: isScriptAdded ? true : false,
    language: localStorage.getItem('stt-language') || 'en-US',
  })

  useEffect(() => {
    window.scroll(0, 0)
  }, [])

  const handleSettingChange = (setting, value) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }))
    if (setting === 'language') {
      localStorage.setItem('stt-language', value);
    }
  }

  const [showTooltip, setShowTooltip] = useState(false);
  const [showTooltip2, setShowTooltip2] = useState(false);

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">Loading...</div>
    )
  }

  if (user === null) {
    return <Navigate to={'/login'} />
  }
  return (
    <div className="py-28 px-3 sm:px-6 lg:px-8 font-main text-primary">
      <div className="max-w-3xl mx-auto">
        <div className="bg-secondary border border-zinc-800 shadow-xl rounded-2xl overflow-hidden">
          <div className="px-3 py-16 sm:px-8">
            <h1 className="text-3xl font-bold mb-8">
              Settings
            </h1>

            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-semibold mb-6">
                  General
                </h2>

                <div className="space-y-6">
                  <div className="flex items-center bg-gray-800 justify-between p-4 rounded-xl">
                    <span className="lg:font-medium">
                      Notifications
                    </span>
                    <input
                      type="checkbox"
                      className="toggle-checkbox"
                      checked={settings.notifications}
                      onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                    />
                  </div>

                  <div className="flex items-center bg-gray-800 justify-between p-4 rounded-xl">
                    <span className="flex relative gap-2 lg:font-medium">
                      Voice Commands
                      <span onMouseLeave={() => setShowTooltip(!showTooltip)} onMouseEnter={() => setShowTooltip(!showTooltip)} tabindex="0" aria-label="tooltip 3" role="link" class="focus:outline-none focus:ring-gray-300 rounded-full focus:ring-offset-2 focus:ring-2 focus:bg-gray-200 relative" onmouseover="showTooltip(3)" onfocus="showTooltip(3)" onmouseout="hideTooltip(3)">
                        <div class=" cursor-pointer">
                          <svg aria-haspopup="true" xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-info-circle" width="25" height="25" viewBox="0 0 24 24" stroke-width="1.5" stroke="#A0AEC0" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" />
                            <circle cx="12" cy="12" r="9" />
                            <line x1="12" y1="8" x2="12.01" y2="8" />
                            <polyline points="11 12 12 12 12 16 13 16" />
                          </svg>
                        </div>
                      </span>
                      {showTooltip && <div id="tooltip1" role="tooltip" class="z-20 -mt-20 w-64 absolute left-[8.6rem] top-7 transition duration-150 ease-in-out ml-8 shadow-lg bg-zinc-900 p-4 rounded-lg">
                        <svg class="absolute left-0 -ml-2 bottom-0 top-0 h-full" width="9px" height="16px" viewBox="0 0 9 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                          <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                            <g id="Tooltips-" transform="translate(-874.000000, -1029.000000)" fill="#18181b">
                              <g id="Group-3-Copy-16" transform="translate(850.000000, 975.000000)">
                                <g id="Group-2" transform="translate(24.000000, 0.000000)">
                                  <polygon id="Triangle" transform="translate(4.500000, 62.000000) rotate(-90.000000) translate(-4.500000, -62.000000) " points="4.5 57.5 12.5 66.5 -3.5 66.5"></polygon>
                                </g>
                              </g>
                            </g>
                          </g>
                        </svg>
                        <p class="text-sm font-bold text-primary pb-1">Voice commands</p>
                        <p class="text-xs leading-4 text-zinc-400 pb-3">Enables Text-to-Speech (TTS) by selecting text and clicking the button. Also works on speech buttons across the website for hands-free listening.</p>
                      </div>}
                    </span>
                    <input
                      type="checkbox"
                      className="toggle-checkbox"
                      checked={settings.voiceCommands}
                      onChange={(e) => { handleSettingChange('voiceCommands', e.target.checked); toggleScript() }}
                    />
                  </div>

                  <div className="flex items-center bg-gray-800 justify-between p-4 rounded-xl">
                    <span className="lg:font-medium relative flex gap-2">
                      Language
                      <span onMouseLeave={() => setShowTooltip2(!showTooltip2)} onMouseEnter={() => setShowTooltip2(!showTooltip2)} tabindex="0" aria-label="tooltip 3" role="link" class="focus:outline-none focus:ring-gray-300 rounded-full focus:ring-offset-2 focus:ring-2 focus:bg-gray-200 relative" onmouseover="showTooltip(3)" onfocus="showTooltip(3)" onmouseout="hideTooltip(3)">
                        <div class=" cursor-pointer">
                          <svg aria-haspopup="true" xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-info-circle" width="25" height="25" viewBox="0 0 24 24" stroke-width="1.5" stroke="#A0AEC0" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" />
                            <circle cx="12" cy="12" r="9" />
                            <line x1="12" y1="8" x2="12.01" y2="8" />
                            <polyline points="11 12 12 12 12 16 13 16" />
                          </svg>
                        </div>
                      </span>
                      {showTooltip2 && <div id="tooltip1" role="tooltip" class="z-20 -mt-20 w-64 absolute left-20 top-7 transition duration-150 ease-in-out ml-8 shadow-lg bg-zinc-900 p-4 rounded-lg">
                        <svg class="absolute left-0 -ml-2 bottom-0 top-0 h-full" width="9px" height="16px" viewBox="0 0 9 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                          <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                            <g id="Tooltips-" transform="translate(-874.000000, -1029.000000)" fill="#18181b">
                              <g id="Group-3-Copy-16" transform="translate(850.000000, 975.000000)">
                                <g id="Group-2" transform="translate(24.000000, 0.000000)">
                                  <polygon id="Triangle" transform="translate(4.500000, 62.000000) rotate(-90.000000) translate(-4.500000, -62.000000) " points="4.5 57.5 12.5 66.5 -3.5 66.5"></polygon>
                                </g>
                              </g>
                            </g>
                          </g>
                        </svg>
                        <p class="text-sm font-bold text-primary pb-1">Language</p>
                        <p class="text-xs leading-4 text-zinc-400 pb-3">Choose a language for Speech Recognition, ensuring accurate voice input across the website.</p>
                      </div>}
                    </span>
                    <select
                      className="select-input"
                      value={settings.language}
                      onChange={(e) => handleSettingChange('language', e.target.value)}>
                      <option className='bg-secondary' value="en">English</option>
                      <option className='bg-secondary' value="hi-IN">Hindi</option>
                      <option className='bg-secondary' value="gu-IN">Gujarati</option>
                      <option className='bg-secondary' value="mr-IN">Marathi</option>
                      <option className='bg-secondary' value="bn-IN">Bengali</option>
                      <option className='bg-secondary' value="ml-IN">Malayalam</option>
                      <option className='bg-secondary' value="te-IN">Telugu</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
