import landing from "./landing/registry";
import basic from "./basic/registry";
import voyage from "./voyage/registry";
import neoncn from "./neoncn/registry";
import thread from "./thread/registry";
import system from "./system/registry";
import help from "./help/registry";
import notfound from "./notfound/registry";
import seegson from "./seegson/registry";
import auth from "./auth/registry";
import dashboard from "./dashboard/registry";
import characters from "./characters/registry";
import games from "./games/registry";
import admin from "./admin/registry";
import missions from "./missions/registry";
import bottle from "./bottle/registry";
import ictomb from "./ictomb/registry";
import meacrp from "./meacrp/registry";
import moonlt from "./moonlt/registry";

const registry = {
  ...landing,
  ...basic,
  ...voyage,
  ...neoncn,
  ...thread,
  ...system,
  ...help,
  ...notfound,
  ...seegson,
  ...auth,
  ...dashboard,
  ...characters,
  ...games,
  ...admin,
  ...missions,
  ...bottle,
  ...ictomb,
  ...meacrp,
  ...moonlt,
};

export default registry;
