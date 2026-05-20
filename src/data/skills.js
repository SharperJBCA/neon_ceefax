// Mothership RPG skills — update as needed
const trained_skills = [
  { id: "linguistics",          name: "Linguistics" , requires: [], hover:"The study of languages."},
  { id: "computers",            name: "Computers" , requires:[], hover:"Use of computer software."},
  { id: "mathematics",          name: "Mathematics" , requires:[], hover:"The science of numbers."},
  { id: "rimwise",              name: "Rimwise" , requires:[], hover:"Knowledge of criminal underworld tactics."},
  { id: "archaeology",          name: "Archaeology" , requires:[], hover:"Study of history through excavation of sites."},
  { id: "art",                  name: "Art" , requires:[], hover:"Expressions of creative skill."},
  { id: "zoology",              name: "Zoology" , requires:[], hover:"Study of animal behaviour and physiology."},
  { id: "botany",               name: "Botany" , requires: [], hover:"Study of planet behaviour and physiology."},
  { id: "geology",              name: "Geology" , requires: [], hover:"Study of history and processes of natural planetary features."},
  { id: "industrial_equipment", name: "Industrial Equipment" , requires: [], hover:"Use and maintence of heavy machinary."},
  { id: "jury_rigging",         name: "Jury-Rigging" , requires:[], hover:"The ability to repurpose objects for an unintended use."},
  { id: "chemistry",              name: "Chemistry" , requires:[], hover:"Study of interactions between substances."},
  { id: "zero_g",               name: "Zero-G" , requires:[], hover:"Experience of working in an environment with no gravity."},
  { id: "theology",               name: "Theology" , requires:[], hover:"Study of religion."},
  { id: "military_training",    name: "Military Training" , requires:[], hover:"Knowledge of techniques and procedures used by armed forces."},
  { id: "athletics",            name: "Athletics", requires:[], hover:"Training in physical activity." },
]

const expert_skills = [
  { id: "psychology",           name: "Psychology" , hover:""},
  { id: "pathology",            name: "Pathology"  , hover:""},
  { id: "field_medicine",       name: "Field Medicine"  , hover:""},
  { id: "ecology",              name: "Ecology"  , hover:""},
  { id: "asteroid_mining",      name: "Asteroid Mining"  , hover:""},
  { id: "mechanical_repair",    name: "Mechanical Repair"  , hover:""},
  { id: "explosives",           name: "Explosives"  , hover:""},
  { id: "pharmacology",         name: "Pharmacology"  , hover:""},
  { id: "hacking",              name: "Hacking" , hover:"" },
  { id: "piloting",             name: "Piloting" , hover:"" },
  { id: "physics",             name: "Physics"  , hover:""},
  { id: "mysticism",            name: "Mysticism"  , hover:""},
  { id: "wilderness_survival",              name: "Wilderness Survival"  , hover:""},
  { id: "firearms",             name: "Firearms"  , hover:""},
  { id: "hand_to_hand_combat",name: "Hand-to-Hand Combat"  , hover:""},
]

const master_skills = [
  { id: "sophontology",         name: "Sophontology"  , hover:""},
  { id: "exobiology",         name: "Exobiology"  , hover:""},
  { id: "surgery",              name: "Surgery" , hover:"" },
  { id: "planetology",              name: "Planetology"  , hover:""},
  { id: "robotics",              name: "Robotics"  , hover:""},
  { id: "engineering",              name: "Engineering"  , hover:""},
  { id: "cybernetics",              name: "Cybernetics"  , hover:""},
  { id: "artificial_intelligence",              name: "Artificial Intelligence"  , hover:""},
  { id: "hyperspace",              name: "Hyperspace"  , hover:""},
  { id: "xenoesotericism",              name: "Xenoesotericism"  , hover:""},
  { id: "command",              name: "Command"  , hover:""},

]

const skills = {
  trained_skills: trained_skills,
  expert_skills: expert_skills,
  master_skills: master_skills
}

export default skills;
