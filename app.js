const smjerovi = ['A', 'B', 'C', 'D'];

let prijave = [
    {
        ime: 'Marko',
        prezime: 'Markovic',
        brIndeksa: '5/22',
        smjer: 'C',
        budzet: true,
        predmet: 'Racunari i programiranje'
    },
    {
        ime: 'Ana',
        prezime: 'Markovic',
        brIndeksa: '5/22',
        smjer: 'B',
        budzet: false,
        predmet: 'Racunari i programiranje'
    },
    {
        ime: 'Ana',
        prezime: 'Bogavac',
        brIndeksa: '7/22',
        smjer: 'A',
        budzet: false,
        predmet: 'Analiza 1'
    },
    {
        ime: 'Nikola',
        prezime: 'Bogavac',
        brIndeksa: '7/22',
        smjer: 'D',
        budzet: true,
        predmet: 'Uvod u kompjuterske nauke'
    }
]

const predmeti = {
    'A': ['Analiza 1', 'Linearna algebra', 'Uvod u matematicku logiku', 'Engleski1', 'Racunari i programiranje'],
    'B': ['Analiza 1', 'Linearna algebra', 'Uvod u matematicku logiku', 'Engleski1', 'Racunari i programiranje'],
    'C': ['Analiza 1', 'Analiticka geometrija', 'Uvod u kompjuterske nauke', 'Uvod u matematicku logiku', 'Engleski1', 'Racunari i programiranje'],
    'D': ['Matematika 1', 'Uvod u matematicku logiku', 'Engleski1', 'Racunari i programiranje'],
}

function createTableRow(prijava) {
    //Na pocetku funkcije kreiramo red tabele
    tabelaRed = document.createElement('tr');

    /*Koristimo innerHTML da promijenimo sadrzaj kreiranog reda (pazi da koristis backticks ``).
      Vrijednosti same prijave postavljamo preko string interpolation, tj. ${prijava.nekaVrijednost} unutar definisanog HTML
    */
    tabelaRed.innerHTML = `
        <td>${prijava.ime}</td>
        <td>${prijava.prezime}</td>
        <td>${prijava.smjer}</td>
        <td>${prijava.brIndeksa}</td>
        <td>${prijava.budzet ? 'budzet' : 'samofinansiranje'}</td>
        <td>${prijava.predmet}</td>
    `;

    //Zasebno definisemo cell za remove dugme, te kreiramo dugme i posavljamo vrijednost njegovog teksta
    removeButtonCell = document.createElement('td');
    removeButton = document.createElement('button');
    removeButton.innerText = 'x';

    /*Preko addEventListener zadajemo neku funkcionalnost dugmetu, prvi argument 'click' oznacava akciju
    koja triggeruje ovo dugme, a drugi argument (ovdje arrow funkcija) je funkcija koja ce biti pozvana 
    kada se izvrsi akcija iz prvog argumenta (tj. klik)*/
    removeButton.addEventListener('click', (e) => {

        //Na klik pozivamo filter metod, tako da ostanu svi redovi sem onog u kom je dugme
        prijave = prijave.filter(item => {
            return item.brIndeksa !== prijava.brIndeksa || item.smjer !== prijava.smjer || item.predmet !== prijava.predmet;
            //Mozemo da poredimo sa prijava.brIndeksa i prijava.smjer i prijava.predmet jer je arrow funkcija
        });

        clearTable();
        azurirajUkupnePrijave();
        fillTable(prijave);
    })

    //Ubacujemo dugme u cell za dugme, a zatim i sam cell u odgovarajuci red
    removeButtonCell.appendChild(removeButton);
    tabelaRed.appendChild(removeButtonCell);

    return tabelaRed;
}

function fillTable(prijave) {
    //QuerySelector da bi dobili body tabele
    tabela = document.querySelector('tbody');

    //Pozivamo for loop za sve prijave iz prijave array-a
    for(let i=0; i < prijave.length; i++) {
        tabela.appendChild(createTableRow(prijave[i]));
        /*Pozivamo createTableRow funkciju za datu prijavu, a onda je preko
        appendChild metode tabele "ubacujemo" u tabelu*/
    };
}

function clearTable() {
    const table = document.querySelector('tbody');
    table.innerHTML = '';
}

//Dodata funkcija (by yours truly) koja cisti form fields
function clearForm() {
    let nameField = document.getElementById('input-ime-prezime');
    let indexField = document.querySelector('#input-index');
    let smjerField = document.querySelector("input[type='radio']:checked");
    let budgetField = document.querySelector('#budzet'); 

    nameField.value = '';
    indexField.value = '';
    smjerField.checked = false;
    budgetField.checked = false;
    fillSubjectsList([]);
}

function sortirajPrijave(attr) {
    prijave.sort((a, b) => {
        if (a[attr] < b[attr]) return -1;
        if (a[attr] === b[attr]) return 0;
        return 1;
    })
}

//Funkcija koja azurira vrijednost ukupnog broja prijava (definisan u table footer-u)
function azurirajUkupnePrijave() {
    const prijaveBrojac = document.getElementById('prijave-brojac');

    prijaveBrojac.innerText = prijave.length;
}

function submit(e) {
    e.preventDefault();

    let imePrezime = document.getElementById('input-ime-prezime').value;
    let brojIndeksa = document.getElementById('input-index').value;
    let smjer = document.querySelector("input[type='radio']:checked").value;
    let budzet = document.getElementById('budzet').checked;

    let predmetSelector = document.getElementById('select-predmet');
    let predmetIndex = predmetSelector.selectedIndex;
    let selectedPredmet = predmetSelector.options[predmetIndex];
    let predmetIme = selectedPredmet.value;

    let imePrezimeNiz = imePrezime.split(' ');

    prijave.push({
            ime: imePrezimeNiz[0],
            prezime: imePrezimeNiz[1],
            brIndeksa: brojIndeksa,
            smjer: smjer,
            budzet: budzet,
            predmet: predmetIme
    });

    clearTable();
    clearForm();
    fillTable(prijave);
    azurirajUkupnePrijave();
}

function fillSubjectsList(activeSubjects) {
    //Startujemo sa praznim nizom
    let allSubjects = [];

    //Spaja se svaki array iz predmeti objekta pomocu concat metoda
    for(let i = 0; i < smjerovi.length; i++) {
        allSubjects = allSubjects.concat(predmeti[smjerovi[i]]);
    }

    //Filtriramo allSubjects array pomocu filter metoda, izbacujuci duplikate
    allSubjects = allSubjects.filter((item, pos) => {
        return allSubjects.indexOf(item) === pos;
    });

    //Selektovanje liste, tj. select dropdown-a
    selectList = document.getElementById('select-predmet');
    selectList.innerHTML = '';

    //Dodajemo sve options u selectList
    for(let i = 0; i < allSubjects.length; i++) {
        let option = document.createElement('option');
        option.value = allSubjects[i];
        option.innerHTML = allSubjects[i];
        /*activeSubjects predajemo kao parametar funkciji (tj. to je argument pri pozivu funkcije kada pritisnemo dugme, kod se nalazi pri dnu)
          activeSubjects zapravo predstavlja sve predmete koji selectovan smjer ima.
          Ako se neki predmet iz allSubjects ne nalazi u activeSubjects (provjeravamo preko negacije includes() metode), postavljamo opciju kao disabled
        */
        option.disabled = !activeSubjects.includes(allSubjects[i]);
        selectList.appendChild(option)
    }
}

fillTable(prijave);
azurirajUkupnePrijave();

btn = document.getElementById('button-submit');
btn.addEventListener('click', submit);

btnCancel = document.getElementById('button-cancel');
btnCancel.addEventListener('click', clearForm);

radioButtons = document.querySelectorAll('input[type="radio"]');

fillSubjectsList([]);

for(let i = 0; i < radioButtons.length; i++) {
    radioButtons[i].addEventListener('click', (e) => {
        let selectedSmjer = e.target.value;
        fillSubjectsList(predmeti[selectedSmjer]);
    })
}