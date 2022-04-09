const { MessageEmbed } = require("discord.js");

function normalizeJSDoc(str) {
  return str.replace(/\{@link\s([^}]+)\}/g, "$1").replace("\n", " ");
}

function arraysToStr(arr, join = "", meta) {
  let str = runArrToStr(arr, join, meta);
  str = str.replaceAll(`${join}<`, "<").replaceAll(`<${join}`, "<").replaceAll(`${join}>`, ">").replaceAll(`>${join}`,">").replaceAll("<", "\\<");
  if(str.endsWith(join)) str = str.substring(0, str.length-join.length);
  return str;
}
function runArrToStr(arr, join = "", meta){
  let str = "";
  arr.forEach(a => {
    if (Array.isArray(a)) {
      str += runArrToStr(a, join, meta);
    } else {
      if(meta && meta.classes.includes(a)) str += `[${a}](${meta.doc}class/${a})` + join;
      else if(meta && meta.typedefs.includes(a)) str += `[${a}](${meta.doc}typedef/${a})` + join;
      else str += a + join;
    }
  });
  return str;
}

function normalizeStr(str) {
  return str.replace(/<info>|<\/info>/g, "");
}
function buildGeneralEmbed(parent, meta) {
  let description = "";
  if (parent.description) description += `**Description:** ${normalizeJSDoc(parent.description)}`;
  if (parent.props?.length) {
    description += "\n\n**Properties:**\n";
    parent.props.forEach((p, index) => {
      description += `\`${p.name}\`${index + 1 < parent.props.length ? ", " : ""}`;
    });
  }
  if (parent.methods?.length) {
    description += "\n\n**Methods:**\n";
    parent.methods.forEach((m, index) => {
      description += `\`${m.name}\`${index + 1 < parent.methods.length ? ", " : ""}`;
    });
  }
  if (parent.events?.length) {
    description += "\n\n**Events:**\n";
    parent.events.forEach((e, index) => {
      description += `\`${e.name}\`${index + 1 < parent.events.length ? ", " : ""}`;
    });
  }
  if (parent.meta) description += `\n\n[Source code](${meta.github + parent.meta.path + "/" + parent.meta.file + "#L" + parent.meta.line})`;
  description = normalizeStr(description);
  const embed = new MessageEmbed()
    .setAuthor({ name: meta.name + " - " +parent.name, url: `${meta.doc}${parent.type}/${parent.name}`, iconURL: "https://cdn.discordapp.com/attachments/871732319449395240/959924116046090250/ezgif-5-73b32bedb6.png" })
    .setDescription(description)
    .setColor(0x00AE86);
  return embed;
}

function buildSpecificEmbed(parent, child, meta) {
  let description = "";
  if (child.description) description += `**Description:** ${normalizeJSDoc(child.description)}`;
  if (child.params?.length) {
    description += "\n\n**Parameters:**\n";
    child.params.forEach(p => {
      description += `- \`${p.name}\` ${(arraysToStr(p.type, " | ", meta))} ${p.description ? "\n" + p.description : ""}`;
    });
  }
  if (child.returns?.length) {
    description += "\n**Returns:**\n";
    description += arraysToStr(child.returns, "");
  }
  if (child.examples?.length) {
    description += "\n**Examples:**\n";
    child.examples.forEach(e => {
      description += `\`\`\`js\n${e}\n\`\`\``;
    });
  }
  if (child.meta) description += `\n\n[Code source](${meta.github + child.meta.path + "/" + child.meta.file + "#L" + child.meta.line})`;
  description = normalizeStr(description);
  const embed = new MessageEmbed()
    //.setTitle(child.async ? `[async] ${parent.name + "#" + child.name}` : parent.name + "#" + child.name)
    .setAuthor({ name: child.async ? `${meta.name + " - " + "[async] " +parent.name + "#" + child.name}` : meta.name + " - " + parent.name + "#" + child.name, url: `${meta.doc}${parent.type}/${parent.name}?scrollTo=${child.name}`, iconURL: "https://cdn.discordapp.com/attachments/871732319449395240/959924116046090250/ezgif-5-73b32bedb6.png" })
    .setColor(0x00AE86)
    .setDescription(description);
  return embed;
}

module.exports = { buildGeneralEmbed, buildSpecificEmbed };


