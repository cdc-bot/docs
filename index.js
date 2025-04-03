function parse(md){
    var lines = md.split("\n")
    var ret = {};
    var title = lines[0].replace("# ","").replace("\r","");
    lines.splice(0,1);
    var cur = "";
    for (line of lines){
        if (line.startsWith("<!")) {cur = line.replace("<!","").replace("\r","");ret[cur]=[]; continue;}
        if (line.startsWith("!>")) {cur = "";continue}
        if (ret[cur]) ret[cur].push(line.replace("\r",""))
    }
    for (key of Object.keys(ret)){
        ret[key] = ret[key].join("\n");
    }
    return {title:title,...ret};
}

function createUI(data){
    console.log(data);
    var details = document.createElement("details");
    var summary = document.createElement("summary");
    summary.innerText = data.title;
    details.appendChild(summary);
    for (key of Object.keys(data)){
        if (key == "title") continue;
        var div = document.createElement("div");
        div.setAttribute("class","link-display");
        var a = document.createElement("a");
        a.text = key;
        div.appendChild(a);
        details.appendChild(div);
    }
    details.setAttribute("open","");
    document.getElementById("s_content").appendChild(details);
}

async function createFromListing(){
    var _l = await fetch("md/listing");
    var listing = (await _l.text()).split("\n");
    for (item of listing){
        var md = await fetch("md/"+item);
        createUI(parse(await md.text()));
    }
}

createFromListing();