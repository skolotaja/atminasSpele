class AtminasSpele {
    constructor (id){
        this.konteiners=document.getElementById(id);
        this.divPogas=document.createElement("div");
        this.divPogas.setAttribute("class","pogas");
        this.divLaukums=document.createElement("div");
        this.divLaukums.setAttribute("class","laukums");
        this.konteiners.appendChild(this.divPogas);
        this.konteiners.appendChild(this.divLaukums);   //Izveidoti ekrānā divi laukumi - vienā būs pogas un statiskā informācija - otrā spēles kārtis

        let btnJaunaSpele = document.createElement("button");
        btnJaunaSpele.innerHTML="Jauna spēle";
        btnJaunaSpele.onclick = () => this.jaunaSpele();
        btnJaunaSpele.setAttribute("class", "poga");
        this.divPogas.appendChild(btnJaunaSpele);

        this.boxRekords=document.createElement("span");
        this.boxRekords.setAttribute("id","rekords");
        this.boxRekords.innerHTML="Vēl nav spēlēts.";

        this.divRezultats=document.createElement("div");
        this.divRezultats.innerHTML="Labākais rezultāts:";
        this.divRezultats.setAttribute("class","teksts");
        this.divRezultats.appendChild(this.boxRekords);
        this.divPogas.appendChild(this.divRezultats);

        this.boxGajieni=document.createElement("span");
        this.boxGajieni.setAttribute("id","rekords");
        this.boxGajieni.innerHTML=0;

        this.divGajieni=document.createElement("div");
        this.divGajieni.innerHTML="Gājienu skaits:";
        this.divGajieni.setAttribute("class","teksts");
        this.divGajieni.appendChild(this.boxGajieni);
        this.divPogas.appendChild(this.divGajieni);

        this.ParuSkaits=6;

        this.statuss=AtminasSpele.STATUSS_NEINICIALIZETS; //Vēl nav spēle
        this.GajienuSkaits=0; //Lai var uzstādīt rekordus un ir sacensības gars
        this.Rekords; //Kur glabāt rekordu. 
        this.RedzamoSkaits=0; //Cik atvērtas kartiņas
        this.NeatminetoSkaits=6; //Cik aizvērti pāri kartiņām (max - 6).
        this.kartinuMasivs=[]; //Šeit glabāsies konkrētās spēles masīvs.
        this.PirmaKarts=0;

    }

    set GajienuSkaits(skaitlis){
        this._gajienuSkaits=skaitlis;
        this.boxGajieni.innerHTML=skaitlis;
    }

    get GajienuSkaits(){
        return this._gajienuSkaits;
    }

    set Rekords(skaitlis){
        this._rekords=skaitlis;
        this.boxRekords.innerHTML=skaitlis;
    }

    get Rekords(){
        return this._rekords;
    }

    jaunaSpele(){
        this.samaisaKartis();
        this.zimeKartis();
        this.GajienuSkaits=0;
        this.RedzamoSkaits=0;
        this.NeatminetoSkaits=this.ParuSkaits;
        this.statuss=AtminasSpele.STATUSS_SPELE;
    }

    samaisaKartis(){                            //Samaisa Kāršu masīvu.
        this.kartinuMasivs=[];                   //Nepieciešamo kāršu masīvs --Dace
        for(let i=1; i<=this.ParuSkaits; i++){
            this.kartinuMasivs.push(i,i);
        }

        let currentIndex = this.kartinuMasivs.length,
            temporaryValue, randomIndex;
        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = this.kartinuMasivs[currentIndex];
            this.kartinuMasivs[currentIndex] = this.kartinuMasivs[randomIndex];
            this.kartinuMasivs[randomIndex] = temporaryValue;
        }

        console.log(this.kartinuMasivs);
    }

    zimeKartis(){                           //Uzzīmē kārtis un piešķir tām vērtību no masīva

        this.divLaukums.innerHTML = "";

        for (let i=1; i<=this.kartinuMasivs.length; i++) {
            let karte = document.createElement("div");
            karte.innerHTML = "<img src='img/smaids-0.png'/>";
            karte.setAttribute("class","spele-karte");
            karte.setAttribute("id", "kartina" + i);
            karte.vertiba=this.kartinuMasivs[i-1];
            karte.onclick = (evt) => {this.atverKarti(i)};
            this.divLaukums.appendChild(karte);
          }      
        console.log("samaisa jaunu laukumu");
    }

    atverKarti(id){
        if(this.statuss===AtminasSpele.STATUSS_SPELE){
            let kartina=document.getElementById("kartina"+id);

            if(kartina.classList.contains("open")){     //Ja jau atvērta kārts, tad nevajag veikt darbību.
                console.log("jau atvērts")
                return;
            }

            kartina.classList.add("open");
            kartina.innerHTML="<img src='img/smaids-" + kartina.vertiba + ".png'/>";

            if(this.RedzamoSkaits===0){
                this.PirmaKarts=id;
                this.RedzamoSkaits=1;
            }
            else if(this.RedzamoSkaits===1){
                this.GajienuSkaits++;
                this.parbaudaAtverto(id,this.PirmaKarts);
                this.RedzamoSkaits=0;
            }

//Šai f-jai jāparāda id kārts zīmējums, un jāizsauc funkcija, kas pārbauda atvērto kārti.

            console.log("atver kārti",id);
        }
    }

    parbaudaAtverto(id1, id2){
        let vienaKarts=document.getElementById("kartina"+id1);
        let otraKarts=document.getElementById("kartina"+id2);
        if(vienaKarts.vertiba===otraKarts.vertiba){
            console.log("vienādi");
            this.NeatminetoSkaits--;
            if(this.NeatminetoSkaits===0){
                this.statuss=AtminasSpele.STATUSS_UZVARA;
                this.uzvara();
            }
        }else{
            console.log("dažādi");
            this.statuss=AtminasSpele.STATUSS_PAUZE;
            setTimeout(()=>{
                this.statuss=AtminasSpele.STATUSS_SPELE;
                this.aizvertKarti(id1);
                this.aizvertKarti(id2);
            },1000);
        };

//Vispirms jāpārbauda, cik kārtis atvērtas. 
//Ja viena, tad pieskaita gājienu skaitam vienu.
//Ja divas, tad nepieskaita jaunu gājienu, bet nogaida 2 sekundes un pārbauda abas kārtis.
//Kārtīm jābūt vērtībām, kuras savā starpā salīdzināt. 
//Ja vērtības dažādas, tad aizver atvērtās kārtis;
//ja vērtības vienādas, tad noslēpj kārtis, samazina neatminēto pāru skaitu par 1
// un pārbauda, vai ir vēl kāda neatvērta kārts.
//Ja vairs nav neatvērto kāršu, tad statuss - uzvara.


        console.log("parbaude", vienaKarts.vertiba, otraKarts.vertiba);
    }
    aizvertKarti(id){
        let karts=document.getElementById("kartina"+id);
        karts.classList.remove("open");
        karts.innerHTML = "<img src='img/smaids-0.png'/>";

        console.log("aizver",id);
        return;

    }
    uzvara(){
        if (this.statuss===AtminasSpele.STATUSS_UZVARA){
            this.divLaukums.innerHTML+="<h1>Uzvara!!!!</h1>"
            if(this.Rekords){
                if(this.Rekords>this.GajienuSkaits){
                    this.Rekords=this.GajienuSkaits;
                }
            }else{
                this.Rekords=this.GajienuSkaits;
            }
        }
    };

}

AtminasSpele.STATUSS_SPELE=1;
AtminasSpele.STATUSS_UZVARA=2;
AtminasSpele.STATUSS_PAUZE=3;
AtminasSpele.STATUSS_NEINICIALIZETS=0;