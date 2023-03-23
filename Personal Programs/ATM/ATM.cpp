// ATM.cpp
//

#include<iostream>
#include<fstream>
#include<string>
using namespace std;

string usn;
int tm;
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
    cout << "**********MENU**********" << endl;
    cout << "1. Check Balance" << endl;
    cout << "2. Deposit" << endl;
    cout << "3. Widthdraw" << endl;
    cout << "4. Exit" << endl;
    cout << "************************" << endl;
}

int main()
{
    // Variables
    int option;
    double balance = 500, depositAmount, withdrawAmount;

    int choice, i;
    string ans, psd, name, fname, bio, usern, pw, line, nusn;
    ofstream fileo;
    ifstream filei;


    while (login == false)
    {
        cout << "\nChoose one option:\n1. Log In(press 1 to select this)\n2. Register(press 2 to select this)\n\npress any key and enter to exit\n";
        cin >> choice;
        if (choice == 1)
        {
            cout << "Enter your username:";
            cin >> usn;
            cout << "\nEnter your password:";
            cin >> psd;
            fname = usn + ".txt";
            filei.open(fname.c_str());
            if (!filei.is_open() && filei.fail())
            {
                cout << "\nYou are not registered, please register before logging in.\n";
                filei.close();
                continue;
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
                continue;
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
    }

        if (login == true) {
            // Do while the exit option (4) isn't selected
            do {
                // Show menu and prompt user to select option
                cout << "\n";
                showMenu();
                cout << "Option: ";
                cin >> option;
                cout << "\n";

                // Switch case for actions based off user selection
                switch (option) {
                    // Case 1: Displays User Balance
                case 1: cout << "Current Balance: " << balance << "$" << endl; break;
                    // Case 2: Allows User to Deposit Amounts
                case 2: cout << "Deposit amount: ";
                    cin >> depositAmount;
                    if (depositAmount < 0) {
                        cout << "Amount must be positive." << endl;
                    }
                    else {
                        balance += depositAmount;
                    }
                    cout << "Current Balance: " << balance << "$" << endl;
                    break;
                    // Case 3: Allows user to Withdraw Amounts
                case 3: cout << "Withdraw amount: ";
                    cin >> withdrawAmount;
                    if (withdrawAmount < 0) {
                        cout << "Amount must be positive." << endl;
                    }
                    if (withdrawAmount <= balance) {
                        balance -= withdrawAmount;
                    }
                    else {
                        cout << "Not enough money." << endl;
                    }
                    cout << "Current Balance: " << balance << "$" << endl;
                    break;
                }
                if (option < 0 || option > 4) {
                    cout << "The option you chose is not available." << endl;
                }
            } while (option != 4);
        }

        return 0;
}