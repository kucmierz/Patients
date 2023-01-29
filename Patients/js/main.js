// przechwyt glownych elementow DOM
// Tabela wyswietlajaca wyniki
const tbl_body = document.querySelector('#tbl_body');

// Formularz nowego pacjenta
const newPatientForm = document.querySelector('#addNewPatientForm');
const inputName = document.querySelector('#inputFirstName');
const inputSurname = document.querySelector('#inputSurname');
const selectOption1 = document.querySelector('#option_1');
const selectOption2 = document.querySelector('#option_2');

// Search Form - for name and options
const searchSurnameStatusForm = document.querySelector('#searchSurnameStatusForm');
const selectActiveCheckBox = document.querySelector('#selectActiveCheckBox');
const searchSurname = document.querySelector('#searchSurname');
const searchOptions = document.querySelector('#searchOptions');
const searchOption_1 = document.querySelector('#searchOption_1');
const searchOption_2 = document.querySelector('#searchOption_2');

// odczyt danych z LS
let patients = JSON.parse(localStorage.getItem('patients'));
if (!patients) {
    patients = [];
}

// funkcja prezentujaca/wgrywajaca dane do tabeli
const presentData = (array) => {
    tbl_body.innerHTML = '';

    array.forEach(element => {
        const option1 = `<select name="option_1" onchange="handleChange(event)" id="${element.id}">
                          <option value="0" ${element.patient_option_1 === '0' ? 'selected' : ''}>jeszcze nie rozpoczęty</option>
                          <option value="1" ${element.patient_option_1 === '1' ? 'selected' : ''}>w trakcie</option>
                          <option value="2" ${element.patient_option_1 === '2' ? 'selected' : ''}>zrobione</option>
                          <option value="3" ${element.patient_option_1 === '3' ? 'selected' : ''}>nie dotyczy</option>
                      </select>`;

        const option2 = `<select name="option_2" onchange="handleChange(event)" id="${element.id}">
                          <option value="0" ${element.patient_option_2 === '0' ? 'selected' : ''}>jeszcze nie rozpoczęty</option>
                          <option value="1" ${element.patient_option_2 === '1' ? 'selected' : ''}>w trakcie</option>
                          <option value="2" ${element.patient_option_2 === '2' ? 'selected' : ''}>zrobione</option>
                          <option value="3" ${element.patient_option_2 === '3' ? 'selected' : ''}>nie dotyczy</option>
                      </select>`;

        const statusText = JSON.parse(element.patient_status) ? 'Aktywny' : 'Nieaktywny';

        tbl_body.innerHTML += `
            <tr class="patient-row" data-status=${element.patient_status}>
                <td>${element.patient_name}</td>
                <td>${element.patient_surname}</td>
                <td>${statusText}</td>
                <td><button class="entry-edit" data-id="edit_btn_${element.id}">Edytuj</button></td>
                <td>${option1}</td>
                <td>${option2}</td>
                <td><button class="entry-delete" data-id="delete_btn_${element.id}">Usun</button></td>
            </tr>`;
    });

}

// metoda reagujaca na zmiane wartosci opcji
const handleChange = (event) => {
    const selectedValue = event.target.value;
    const selectedPatientId = event.target.id;
    // zapisujemy pod option_1 lub _2, zatem:
    const propertyName = `patient_${event.target.name}`;
    // odnalezienie pacjenta o danym id
    const patient = patients.find(p => p.id === parseInt(selectedPatientId));
    // zapis nowej wartosci dla danej opcji
    patient[propertyName] = selectedValue;
    // zapis do LS
    localStorage.setItem('patients', JSON.stringify(patients));
}

// Obsluga zdarzenia dodania nowego pacjenta - utworzenie rekordu i zapis do LS
const handleNewPatient = (event) => {
    event.preventDefault();
    const form = event.target;
    const newPatient = {
        // wczesniejszy zapis
        id: Date.now(),
        patient_name: inputName.value,
        patient_surname: inputSurname.value,
        patient_status: true,
        patient_option_1: selectOption1.value,
        patient_option_2: selectOption2.value

        // nowa sugestia GPT- NIE ZADZIALALA
        // id: Date.now(),
        // patient_name: form.inputName.value,
        // patient_surname: form.inputSurname.value,
        // patient_status: true,
        // patient_option_1: form.selectOption1.value,
        // patient_option_2: form.selectOption2.value
    }
    // console.log(newPatient);
    patients.push(newPatient);
    // zapis do LS
    localStorage.setItem('patients', JSON.stringify(patients));
    // resetowanie formularza - poprzednia wersja
    selectOption1.value = 0;
    selectOption2.value = 0;
    inputName.value = '';
    inputSurname.value = '';

    // // resetowanie formularza - nowa wersja - NIE ZADZIALALA
    // form.selectOption1.value = 0;
    // form.selectOption2.value = 0;
    // form.inputName.value = '';
    // form.inputSurname.value = '';
    presentData(patients);
}

// obsluga zdarzenia wyszukiwania nazwiska i statusu
const handleSearchSurnameStatus = (event) => {
    event.preventDefault();
    let filteredResults = patients;
    let matchingPatients = [];

    // uwzglednienie statusu pacjentow
    filteredResults.forEach(patient => {
        if (selectActiveCheckBox.checked === Boolean(patient.patient_status)) {
            matchingPatients.push(patient);
        }
    });
    filteredResults = matchingPatients;

    // wyszukanie fragmentu nazwiska
    if (searchSurname.value.length > 0) {
        matchingPatients = [];
        filteredResults.forEach(patient => {
            if (patient.patient_surname.toLowerCase().includes(searchSurname.value.toLowerCase())) {
                matchingPatients.push(patient);
            }
        });
        filteredResults = matchingPatients;
    }


    // wyswietlenie danych
    presentData(filteredResults);
}

// resetowanie formularza wyszukiwania nazwiska i statusu
const handleSearchSurnameStatusReset = (event) => {
    event.preventDefault();
    searchSurname.value = ''
    selectActiveCheckBox.checked = true;
    // pokazanie wszystkich wynikow
    presentData(patients);
}

// obsluga zdarzenia wyszukiwania opcji
const handleSearchOptions = (event) => {
    event.preventDefault();
    let filteredResults = patients;

    if (searchOption_1.value !== "4") {
        filteredResults = filteredResults.filter(patient => patient.patient_option_1 === searchOption_1.value);
    }

    if (searchOption_2.value !== "4") {
        filteredResults = filteredResults.filter(patient => patient.patient_option_2 === searchOption_2.value);
    }

    // wyswietlenie danych
    presentData(filteredResults);
}

// resetowanie opcji
const handleSearchOptionsReset = (event) => {
    event.preventDefault();
    // ustawienie wartosci poczatkowych
    searchOption_1.value = 4;
    searchOption_2.value = 4;
    // pokazanie wszystkich wynikow
    presentData(patients);
}

// edycja pacjenta
const editPatient = (patientID) => {
    const patient = patients.find(p => p.id === parseInt(patientID));
    patient.patient_name = prompt('Zmodyfikuj imie pacjenta', patient.patient_name);
    patient.patient_surname = prompt('Zmodyfikuj nazwisko pacjenta', patient.patient_surname);
    patient.patient_status = prompt('Zmodyfikuj status pacjenta', patient.patient_status);
    // zapis do LS i odswiezenie strony
    localStorage.setItem('patients', JSON.stringify(patients));
    location.reload();
}

// kasowanie pacjenta
const deletePatient = (patientID, event) => {
    // znalezienie odpowiedniego pacjenta w tablicy
    // const patient = patients.find(p => p.id === parseInt(patientID));

    // utworzenie nowej tablicy, ktora nie bedzie zawierac pacjenta o danym ID
    const filteredPatients = patients.filter(p => p.id != parseInt(patientID));
    // modyfikacja tablicy glownej i zapis do LS
    patients = filteredPatients;
    localStorage.setItem('patients', JSON.stringify(patients));
    // usuniecie wpisu html
    event.target.parentElement.parentElement.remove();
}

// obsluga klikniecia w tabeli
const handleTableClick = (event) => {
    if (event.target.dataset.id) {
        // console.log(event.target.dataset.id.substr(0, 1));
        // dataset.id zawiera string w postaci slowa 'edit_btn_' + wlasciwe id
        // lub 'delete_btn_' i wlasciwe id elementu
        // kod sprawdza pierwsza litere, ekstrahuje id i uruchamia odpowiednia metode
        const patientID = event.target.dataset.id;
        if (event.target.dataset.id.substr(0, 1) === 'e') {
            editPatient(patientID.substr(9, patientID.length - 1));
            // console.log('edit_btn_'.length);
            // console.log(patientID.substr(9, patientID.length - 1));
        } else {
            // console.log('delete_btn_'.length);
            // console.log(patientID.substr(11, patientID.length - 1));
            deletePatient(patientID.substr(11, patientID.length - 1), event);
        }
    }
}

// wywolanie metody na start - zaladowanie danych
presentData(patients);

// dodanie obslugi zdarzen do formularza dodawania nowego pacjenta
newPatientForm.addEventListener('submit', handleNewPatient);
// dodanie obslugi zdarzen do formularza wyszukiwania nazwiska i statusu
searchSurnameStatusForm.addEventListener('submit', handleSearchSurnameStatus);
searchSurnameStatusForm.addEventListener('reset', handleSearchSurnameStatusReset);
// dodanie obslugi zdarzen do formularza wyszukiwania opcji
searchOptions.addEventListener('submit', handleSearchOptions);
searchOptions.addEventListener('reset', handleSearchOptionsReset);
// dodanie obslugi zdarzen dla tabeli
tbl_body.addEventListener('click', handleTableClick);