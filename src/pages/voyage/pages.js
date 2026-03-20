const landing = {
  blocks: [
    {
      type: "pre",
      text: `_. _  __._ _ * _.  .  , _   . _. _  _
(_.(_)_) [ | )|(_.   \\/ (_)\\_|(_](_](/,
                           ._|   ._|

Humanity has expanded to the stars. Earth is a distant memory.

We journey into the darkness not in a great migration--as many
thought--but in small communities, drifting far and traveling at
relativistic speeds, dividing from each other by unfathomable
distance and time. Our only connections are the thin tethers of
the Quantum Entanglement Communicator (QEC). These precarious
devices bridge the vast distances with near-instantaneous
communication, but provide only enough bandwidth to the ancient
relay hub for simple, plain-text messaging.

Here are the annals of Relay Station 001, housed at the Sun-Earth
Lagrange point L4 in the SOL system. Found within are the records
of transmissions from the oldest and farthest flung ships to have
left Earth of old. These are pen-pal letters, reports, updates,
cries for help, and calls into the darkness. What is delivered to
the system is unfiltered. Some of it is intelligible. For some,
common language has drifted too far for clear translation.

Due to time-debt of relativistic travel, dates of individual
reports may not coincide linearly between ships. Records are
stored chronologically as received at RS001 from each expedition.

----------------------------------------------------------------`,
    },

    {
      type: "links",
      items: [{ label: "Join the Cosmic Voyage", to: "100002.001" }],
    },
    {
      type: "links",
      items: [{ label: "Logs", to: "100002.002" }],
    },

    {
      type: "links",
      items: [{ label: "Explore System Map", to: "system.000" }],
    },
  ],
};

const about = {
  blocks: [
    { type: "h1", text: "Join the Cosmic Voyage" },
    {
      type: "feed",
      className: "r-callout",
      items: [
        { type: "h1", text: "ABOUT ME" },
        {
          type: "pre",
          text: `And so it begins...

        You are here, and so am I. Listen pilgrim for I won't say
        this twice.`,
        },
      ],
    },

    {
      type: "links",
      items: [{ label: "Join the Cosmic Voyage", to: "100002.001" }],
    },
    {
      type: "links",
      items: [{ label: "Logs", to: "100002.002" }],
    },
  ],
};

export default { landing, about };
