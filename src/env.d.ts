/// <reference types="astro/client" />

/// <reference types="lucia" />
declare namespace Lucia {
  type Auth = import("./lib/lucia").Auth;
  type DatabaseUserAttributes = {
    username: string
  };
  type DatabaseSessionAttributes = {};
}
