// ComicCollector.cpp
//

#include<iostream>
#include<fstream>
#include<string>

using namespace std;

int option, tm, choice, i;
string ans, psd, name, fname, fnameCollection, fnameWantlist, bio, usern, pw, line, nusn, usn, series, issueNum, price, sypnosis, special, collection;
ofstream fileo;
ifstream filei;
bool login = false;

void valid(string str)
{
    string dir, user;
    ifstream file;
    dir = str + ".txt";
    file.open(dir.c_str());
    if (!file.is_open() && file.fail())
    {
        //file.close();
        return;
    }
    else
    {
        tm++;
        if (tm == 3)
        {
            cout << "\nThis username already exists\nPlease try Again.";
            //file.close();
            return;
        }
        cout << "\nThis username already exists!\nCreate a username:";
        cin >> usn;
        //file.close();
        valid(usn);
    }
}

// Shows menu
void showMenu() {
    cout << "**********DASHBOARD**********" << endl;
    cout << "1. Add Book" << endl;
    cout << "2. View Collection" << endl;
    cout << "3. View Wantlist" << endl;
    cout << "4. View Series";
    cout << "5. Exit" << endl;
    cout << "*****************************" << endl;
}

void loginRegister() {
    cout << "**********Log In or Register**********" << endl;
    cout << "1. Log In" << endl;
    cout << "2. Register" << endl;
    cout << "3. Exit" << endl;
    cout << "**************************************" << endl;
    cout << "Options: ";
    cin >> choice;
    if (choice == 1)
    {
        cout << "Enter your username:";
        cin >> usn;
        cout << "\nEnter your password:";
        cin >> psd;
        fname = usn + ".txt";
        fnameCollection = usn + "collection" + ".txt";
        fnameWantlist = usn + "wantlist" + ".txt";
        filei.open(fname.c_str());
        if (!filei.is_open() && filei.fail())
        {
            cout << "\nYou are not registered, please register before logging in.\n";
            filei.close();
        }
        getline(filei, usern);
        getline(filei, line);
        getline(filei, pw);
        if (usn == usern && psd == pw)
        {
            cout << "\nYou are successfully logged in. \n";
            login = true;
            filei.close();
        }
        else {
            cout << "\nWrong username or password!\nPlease try Again.\n";
        }
        cout << endl;
    }
    else if (choice == 2)
    {
        cout << "\nEnter your name:";
        cin.ignore();
        getline(cin, name);
        cout << "\nCreate a username:";
        cin >> usn;
        tm = 0;
        valid(usn);
        if (tm >= 3)
        {
        }
        cout << "\nCreate a password:";
        cin >> psd;
        fname = usn + ".txt";
        //cout<<fname;
        fileo.open(fname.c_str());
        fileo << usn << endl << name << endl << psd << endl;
        cout << "\nYou are successfully registered:)";
        cout << "\nPlease Login";
        fileo.close();
    }
    else if (choice <= 0 || choice > 3) {
        cout << "The option you chose is not available." << endl;
    }
}

//Add Book
void addBook() {
    option = 0;
    cout << "**********ADD BOOK**********" << endl;
    cout << "1. Add to Collection" << endl;
    cout << "2. Add to Wantlist" << endl;
    cout << "3. Back" << endl;
    cout << "****************************" << endl;
    cin >> option;
    cout << "\n";

    // Switch case for actions based off user selection
    switch (option) {
        // Case 1: Displays User Balance
    case 1:
        cout << "Series : ";
        getline(cin, series);
        cout << "Issue Number: ";
        getline(cin, issueNum);
        cout << "Price: ";
        getline(cin, price);
        cout << "Sypnosis: ";
        getline(cin, sypnosis);
        cout << "Special Notes: ";
        getline(cin, special);
        fileo.open(fnameCollection.c_str(), fstream::app);
        fileo << "Series: " << series << "\n" << "Issue Number: " << issueNum << "\n" << "Price: " << price << "\n" << "Sypnosis: " << sypnosis << " \n" << "Special Notes: " << special << " \n";
        cout << "\nAdded!";
        fileo.close();
        break;
    case 2:
        cout << "Series : ";
        getline(cin, series);
        cout << "Issue Number: ";
        getline(cin, issueNum);
        cout << "Price: ";
        getline(cin, price);
        cout << "Sypnosis: ";
        getline(cin, sypnosis);
        cout << "Special Notes: ";
        getline(cin, special);
        fileo.open(fnameWantlist.c_str(), fstream::app);
        fileo << "Series: " << series << "\n" << "Issue Number: " << issueNum << "\n" << "Price: " << price << "\n" << "Sypnosis: " << sypnosis << " \n" << "Special Notes: " << special << " \n";
        cout << "\nAdded!";
        fileo.close();
        break;
    case 3:
        break;
    }
    if (option < 0 || option > 3) {
        cout << "The option you chose is not available." << endl;
    }
}

//View Collection
void viewCollection() {
    do {
        option = 0;
        cout << "**********View Collection**********" << endl;
        cout << "1. View Full Collection" << endl;
        cout << "2. View Specific Series (Not Yet Functional)" << endl;
        cout << "3. View Estimated Value (Not Yet Functional)" << endl;
        cout << "4. Back" << endl;
        cout << "***********************************" << endl;
        cin >> option;
        cout << "\n";

        switch (option) {
        case 1:
            filei.open(fnameCollection.c_str());
            getline(filei, collection);
            while (filei) {
                cout << collection << endl;
                getline(filei, collection);
            }
            filei.close();
            break;
        case 2:
            cout << "Not Yet Functional";
            break;
        case 3:
            cout << "Not Yet Functional";
            break;
        }
        if (option <= 0 || option > 4) {
            cout << "The option you chose is not available." << endl;
        }
    } while (option != 4);
}

//View Wantlist
void viewWantlist() {
    do{
        option = 0;
        cout << "**********View Wantlist**********" << endl;
        cout << "1. View Full Wantlist" << endl;
        cout << "2. View Specific Series (Not Yet Functional)" << endl;
        cout << "3. View Estimated Value (Not Yet Functional)" << endl;
        cout << "*********************************" << endl;
        cin >> option;
        cout << "\n";
        switch (option) {
        case 1:
            filei.open(fnameWantlist.c_str());
            getline(filei, collection);
            while (filei) {
                cout << collection << endl;
                getline(filei, collection);
            }
            filei.close();
            break;
        case 2:
            cout << "Not Yet Functional";
            break;
        case 3:
            cout << "Not Yet Functional";
            break;
        }
        if (option <= 0 || option > 4) {
            cout << "The option you chose is not available." << endl;
        }
    } while (option != 4);
}

int main()
{
    do {
        loginRegister();
    } while (choice != 3 && login == false);

    if (login == true) {
        // Do while the exit option (5) isn't selected
        do {
            option = 0;
            // Show menu and prompt user to select option
            cout << "\n";
            showMenu();
            cout << "Option: ";
            cin >> option;
            cout << "\n";

            // Switch case for actions based off user selection
            switch (option) {
                // Case 1: Displays User Balance
            case 1: addBook();
                break;
                // Case 2: Allows User to Deposit Amounts
            case 2: viewCollection();
                break;
                // Case 3: Allows user to Withdraw Amounts
            case 3: viewWantlist();
                break;
            case 4:
                cout << "Not Yet Functional";
                break;
            }
            if (option < 0 || option > 5) {
                cout << "The option you chose is not available." << endl;
            }
        } while (option != 5);
    }

    return 0;
}