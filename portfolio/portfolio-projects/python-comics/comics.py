# Title: Comic Book Collection Manager
# Author: Jacob Heffington
# Date: 3/25/2023
# Purpose: A program to manage a collection of comic books.
# Notes: This program is a GUI application that allows the user to add, remove, and view entries in a collection of comic books. The program uses a CSV file to store the collection data. The program also allows the user to export the collection data to a PDF file. 
# The program uses the fpdf library to create the PDF file. 
# The program uses the tkinter library to create the GUI. 

# Import the necessary libraries
import csv # For reading and writing CSV files
from tkinter import Tk, Frame, Label, Button, Entry, Scrollbar, filedialog, StringVar, BooleanVar # For creating the GUI
from tkinter import ttk # For creating the GUI
from fpdf import FPDF # For creating the PDF file
import os # For getting the current working directory


class ComicCollectionApp:
    """
    A class representing the ComicCollectionApp application.

    Methods:
        - init: Initializes a new instance of the ComicCollectionApp class.
        - load_collection: Loads the comic book collection from a CSV file.
        - save_collection: Saves the comic book collection to a CSV file.
        - clear_frame: Clears the main frame of the application.
        - show_home_gui: Displays the home GUI view.
        - show_view_gui: Displays the View Entries GUI view.
        - show_add_gui: Displays the Add Entries GUI view.
        - show_remove_gui: Displays the Remove Entries GUI view.
    """

    def __init__(self, master):
        """
        Initializes a new instance of the ComicCollectionApp class.

        Args:
        - master: the root window of the application

        Returns:
        - None
        """

        # Set the master window of the application
        self.master = master
        # Set the title of the master window
        self.master.title('Comic Book Collection Manager')
        # Set the size of the master window
        self.master.geometry('625x275')

        # Get the screen width and height
        screen_width = self.master.winfo_screenwidth()
        screen_height = self.master.winfo_screenheight()

        # Get the window width and height
        width = 625
        height = 275
        
        # Calculate the x and y coordinates to center the window
        x = int((screen_width/2) - (width/2))
        y = int((screen_height/2) - (height/2))

        # Set the position of the window to the center of the screen
        self.master.geometry(f'{width}x{height}+{x}+{y}')

        # Create the main frame of the application
        self.mainFrame = Frame(self.master)
        self.mainFrame.grid(row=0, column=0, sticky='nsew')

        # Configure the grid layout of the master window
        self.master.grid_rowconfigure(0, weight=1)
        self.master.grid_columnconfigure(0, weight=1)
        self.master.grid_columnconfigure(1, weight=1)
        self.master.grid_columnconfigure(2, weight=1)

        # Create instances of the different GUI views
        self.homeGui = HomeGUI(self)
        self.addGui = AddEntryGUI(self)
        self.removeGui = RemoveEntryGUI(self)
        self.viewGui = ViewGUI(self)

        # Create a list to hold the comic book collection
        self.bookCollection = [['Title', 'Publisher', 'Issue Number']]

        # Load the comic book collection from file
        self.load_collection()

        # Show the home GUI view by default
        self.show_home_gui()

    def load_collection(self):
        """
        Loads the comic book collection from a CSV file.

        Args:
        - None

        Returns:
        - None
        """

        # Try to open the CSV file and read the contents into the book collection list variable if the file exists and has data in it otherwise create a new file
        try:
            # Open the CSV file and read the contents into the book collection list variable
            with open('collection.csv', 'r') as csvFile:
                reader = csv.reader(csvFile, delimiter=',')
                # Try to read the contents of the CSV file into the book collection list variable if the file has data in it otherwise create a new file and save the book collection list variable to it
                try:
                    headers = next(reader)
                    if headers == self.bookCollection[0]:
                        for row in reader:
                            if row not in self.bookCollection:
                                self.bookCollection.append(row)
                except StopIteration:
                    self.save_collection()
        except FileNotFoundError:
            self.save_collection()

    def save_collection(self):
        """
        Saves the comic book collection to a CSV file.

        Args:
        - None

        Returns:
        - None
        """

        # Open the CSV file and write the contents of the book collection list variable to it
        with open('collection.csv', 'w') as csvFile:
            writer = csv.writer(csvFile, delimiter=',')
            writer.writerows(self.bookCollection)

    def clear_frame(self):
        """
        Clears the main frame of the application.

        Args:
        - None

        Returns:
        - None
        """

        # Destroy all widgets in the main frame
        for widget in self.mainFrame.winfo_children():
            widget.destroy()

    def show_home_gui(self):
        """
        Displays the home GUI view.

        Args:
        - None

        Returns:
        - None
        """

        # Clear the main frame and display the home GUI view
        self.clear_frame()
        self.homeGui.display()

    def show_view_gui(self):
        """
        Displays the View Entries GUI view.

        Args:
        - None

        Returns:
        - None
        """

        # Clear the main frame and display the View Entries GUI view
        self.clear_frame()
        self.viewGui.display()

    def show_add_gui(self):
        """
        Displays the Add Entries GUI view.

        Args:
        - None

        Returns:
        - None
        """

        # Clear the main frame and display the Add Entries GUI view
        self.clear_frame()
        self.addGui.display()

    def show_remove_gui(self):
        """
        Displays the Remove Entries GUI view.

        Args:
        - None

        Returns:
        - None
        """

        # Clear the main frame and display the Remove Entries GUI view
        self.clear_frame()
        self.removeGui.display()


class HomeGUI:
    """
    A class representing the home GUI view.

    Methods: 
        - init: Initializes a new instance of the HomeGUI class.
        - display: Creates the display for the home GUI view.
    """


    def __init__(self, app):
        """
        Initializes a new instance of the HomeGUI class.

        Args:
        - app: an instance of the ComicCollectionApp class

        Returns:
        - None
        """

        # Set the ComicCollectionApp instance
        self.app = app

    def display(self):
        """
        Creates the display for the home GUI view.

        Args:
        - None

        Returns:
        - None
        """

        # Set the title of the master window
        self.app.master.title('Comic Book Collection Manager - Home')

        # Create a placeholder label for 1st Column to create white space and add it to the grid
        Label(self.app.mainFrame, width=25).grid(column=0, row=0)

        # Create the naviagtion buttons for the GUI Views and add them to the grid.
        Button(self.app.mainFrame, text='Add Entry', font=('Helvetica',
               10), command=self.app.show_add_gui, width=15).grid(row=0,
                column=1, pady=25)

        Button(self.app.mainFrame, text='Remove Entry', font=('Helvetica',
               10), command=self.app.show_remove_gui,
               width=15).grid(row=1, column=1, pady=25)

        Button(self.app.mainFrame, text='View Entries', font=('Helvetica', 10),
               command=self.app.show_view_gui, width=15).grid(row=2,
                column=1, pady=25)


class AddEntryGUI:

    """
    A class representing the Add Entry GUI view.

    Methods:
        - init: Initializes a new instance of the AddEntryGUI class.
        - display: Creates and displays the widgets for the add entry GUI view.
        - add_entry: Adds the entry to the comic book collection.
    """

    def __init__(self, app):
        """
    Initializes a new instance of the AddEntryGUI class.

    Args:
        - app: an instance of the ComicCollectionApp class

    Returns:
      - None
    """

        # Set the ComicCollectionApp instance
        self.app = app

        # Create the variables for the entry widgets
        self.title = StringVar()
        self.publisher = StringVar()
        self.issueNumber = StringVar()

        # Create the variables for the validation of the entry widgets
        self.titleValid = BooleanVar()
        self.publisherValid = BooleanVar()
        self.issueNumberValid = BooleanVar()
        
        # Set the default values for the validation of the entry widgets
        self.titleValid.set(False)
        self.publisherValid.set(False)
        self.issueNumberValid.set(False)

    def display(self):
        """
        Creates and displays the widgets for the add entry GUI view.

        Args:
            - None

        Returns:
          - None
        """
        
        # Set the title of the master window
        self.app.master.title('Comic Book Collection Manager - Add Entry')

        # Create a placeholder label for 1st and 2nd Columns to create white space and add it to the grid
        Label(self.app.mainFrame, width=20).grid(column=0, row=0)
        Label(self.app.mainFrame, width=20).grid(column=1, row=0)

        # Create the entry widgets for the title, publisher, and issue number and add them to the grid
        self.titleFrame = Frame(self.app.mainFrame)
        self.titleFrame.grid(row=0, column=1, pady=10, sticky='w')
        Label(self.titleFrame, text='Title:').grid(row=0, column=0,
                padx=10, pady=10, sticky='e')
        self.titleEntry = Entry(self.titleFrame, width=20)
        self.titleEntry.grid(row=0, column=1, padx=10, pady=10,
                             sticky='w')

        self.publisherFrame = Frame(self.app.mainFrame)
        self.publisherFrame.grid(row=1, column=1, pady=10, sticky='w')
        Label(self.publisherFrame, text='Publisher:').grid(row=0,
                column=0, padx=10, pady=10, sticky='e')
        self.publisherEntry = Entry(self.publisherFrame, width=16)
        self.publisherEntry.grid(row=0, column=1, padx=10, pady=10,
                                 sticky='w')

        self.issueNumberFrame = Frame(self.app.mainFrame)
        self.issueNumberFrame.grid(row=3, column=1, pady=10, sticky='w')
        Label(self.issueNumberFrame, text='Issue Number:').grid(row=0, column=0, padx=10, pady=10, sticky='e')
        self.issueNumberEntry = Entry(self.issueNumberFrame, width=12)
        self.issueNumberEntry.grid(row=0, column=1, padx=10, pady=10, sticky='w')

        # Create a frame to hold the navigation buttons and add it to the grid
        self.buttonFrame = Frame(self.app.mainFrame)
        self.buttonFrame.grid(row=4, column=1, pady=10, sticky='w')

        # Create the navigation buttons and add them to the button frame
        Button(self.buttonFrame, text='Back', font=('Helvetica', 10),
               command=self.app.show_home_gui, width=10).grid(row=0,
                column=0)

        Button(self.buttonFrame, text='Add', command=self.add_entry,
               width=10).grid(row=0, column=1)
      

        # Create a label to display warning messages and add it to the grid
        self.warningLabel = Label(self.app.mainFrame, text='', fg='red')
        self.warningLabel.grid(row=5, column=1, padx=10, pady=10, sticky='w')

    def add_entry(self):
        """
        Adds a new entry to the comic book collection.

        Args:
          - None

        Returns:
          - None
        """

        # Get the values from the entry widgets
        title = self.titleEntry.get()
        publisher = self.publisherEntry.get()
        issueNumber = self.issueNumberEntry.get()

        # Check if the entry widgets are empty
        if title and publisher and issueNumber:
            # Check if the entry already exists
            if [title, publisher, issueNumber] \
                not in self.app.bookCollection:
                self.app.bookCollection.append([title, publisher,
                        issueNumber])
                # Save the comic book collection to the file
                self.app.save_collection()
                self.titleEntry.delete(0, 'end')
                self.publisherEntry.delete(0, 'end')
                self.issueNumberEntry.delete(0, 'end')
                # Display a success message
                self.warningLabel.config(text='Entry added successfully.'
                        )
            else:
                # Display a warning message that the entry already exists
                self.warningLabel.config(text='This entry already exists.'
                        )
        else:
            # Display a warning message that the entry widgets are empty
            self.warningLabel.config(text='Please fill in all fields.')


class RemoveEntryGUI:
    """
    The GUI view for removing an entry from the comic book collection.

    Methods:
        - init: Initializes the RemoveEntryGUI class.
        - display: Creates and displays the widgets for the remove entry GUI view.
        - remove_entry: Removes an entry from the comic book collection.
    """


    def __init__(self, app):
        """
        Initializes the RemoveEntryGUI class.

        Args:
          - app: The main application object.

        Returns:
            - None
        """
        
        # Set the main application object
        self.app = app

    def display(self):
        """
    Creates and displays the widgets for the remove entry GUI view.

        Args:
        - None

        Returns:
          - None
        """

        # Set the title of the master window
        self.app.master.title('Comic Book Collection Manager - Remove Entry')

        # Create a placeholder label for 1st and 2nd Columns to create white space and add it to the grid
        Label(self.app.mainFrame, width=20).grid(column=0, row=0)
        Label(self.app.mainFrame, width=20).grid(column=1, row=0)

        # Create the entry widgets for the title, publisher, and issue number and add them to the grid
        self.titleFrame = Frame(self.app.mainFrame)
        self.titleFrame.grid(row=0, column=1, pady=10, sticky='w')
        Label(self.titleFrame, text='Title:').grid(row=0, column=0,
                padx=10, pady=10, sticky='e')
        self.titleEntry = Entry(self.titleFrame, width=20)
        self.titleEntry.grid(row=0, column=1, padx=10, pady=10,
                             sticky='w')

        self.publisherFrame = Frame(self.app.mainFrame)
        self.publisherFrame.grid(row=1, column=1, pady=10, sticky='w')
        Label(self.publisherFrame, text='Publisher:').grid(row=0,
                column=0, padx=10, pady=10, sticky='e')
        self.publisherEntry = Entry(self.publisherFrame, width=16)
        self.publisherEntry.grid(row=0, column=1, padx=10, pady=10,
                                 sticky='w')

        self.issueNumberFrame = Frame(self.app.mainFrame)
        self.issueNumberFrame.grid(row=3, column=1, pady=10, sticky='w')
        Label(self.issueNumberFrame, text='Issue Number:').grid(row=0,
                column=0, padx=10, pady=10, sticky='e')
        self.issueNumberEntry = Entry(self.issueNumberFrame, width=12)
        self.issueNumberEntry.grid(row=0, column=1, padx=10, pady=10,
                sticky='w')


        # Create a frame to hold the navigation buttons and add it to the grid
        self.buttonFrame = Frame(self.app.mainFrame)
        self.buttonFrame.grid(row=4, column=1, pady=10, sticky='w')

        # Create the navigation buttons and add them to the button frame
        Button(self.buttonFrame, text='Back', font=('Helvetica', 10),
               command=self.app.show_home_gui, width=10).grid(row=0,
                column=0)

        Button(self.buttonFrame, text='Remove', command=self.remove_entry,
               width=10).grid(row=0, column=1)

        # Create a label to display warning messages and add it to the grid
        self.warningLabel = Label(self.app.mainFrame, text='', fg='red'
                                   )
        self.warningLabel.grid(row=5, column=1, padx=10,
                pady=10, sticky='w')

    def remove_entry(self):
        """
        Removes an entry from the comic book collection.

        Args:
            - None
        Returns:
            - None
        """

        # Get the values from the entry widgets
        title = self.titleEntry.get()
        publisher = self.publisherEntry.get()
        issueNumber = self.issueNumberEntry.get()

        # Check if the entry widgets are empty
        if title and publisher and issueNumber:
            # Check if the entry exists
            entry_to_remove = [title, publisher, issueNumber]
            if entry_to_remove in self.app.bookCollection:
                # Remove the entry from the comic book collection
                self.app.bookCollection.remove(entry_to_remove)
                self.app.save_collection()
                self.titleEntry.delete(0, 'end')
                self.publisherEntry.delete(0, 'end')
                self.issueNumberEntry.delete(0, 'end')
                self.warningLabel.config(text='Entry removed successfully.'
                        )
            else:
                # Display a warning message that the entry does not exist
                self.warningLabel.config(text='Entry not found.')
        else:
            # Display a warning message that the entry widgets are empty
            self.warningLabel.config(text='Please fill in all fields.')


class ViewGUI:
    """
    The GUI view for viewing the comic book collection.

    Methods:
        - init: Initializes the ViewGUI class.
        - display: Creates and displays the widgets for the view GUI view.
        - sortCol: Sorts the entries in the treeview by the column that was clicked.
    """

    def __init__(self, app):
        """
        Initializes the ViewGUI class.

        Args:
            - app: The main application object.

        Returns:
            - None
        """

        # Set the main application object
        self.app = app
        # Set the default sort column
        self.defaultSortCol = 'Title' 

    def display(self):
        """
        Creates and displays the widgets for the view GUI view.

        Args:
            - None

        Returns:
            - None
        """

        # Set the title of the master window
        self.app.master.title('Comic Book Collection Manager - View Entries')
        
        # Create a treeview to display the comic book collection and add it to the grid
        self.tree = ttk.Treeview(self.app.mainFrame, columns=('Title', 'Publisher', 'Issue Number'),
                                 show='headings', height=5)
        self.tree.grid(row=2, column=0, columnspan=3, pady=10)

        # Create the headings for the treeview and make them sortable
        self.tree.heading('Title', text='Title', command=lambda col='Title': self.sortCol(col))
        self.tree.heading('Publisher', text='Publisher', command=lambda col='Publisher': self.sortCol(col))
        self.tree.heading('Issue Number', text='Issue Number', command=lambda col='Issue Number': self.sortCol(col))

        # Create a scrollbar and add it to the grid
        self.scrollbar = Scrollbar(self.app.mainFrame, orient='vertical',
                                   command=self.tree.yview)
        self.scrollbar.grid(row=2, column=3, sticky='ns')

        # Configure the treeview to use the scrollbar
        self.tree.configure(yscrollcommand=self.scrollbar.set)

        # Create a frame to hold the navigation buttons and add it to the grid
        self.buttonFrame = Frame(self.app.mainFrame)
        self.buttonFrame.grid(row=6, column=1, pady=10, sticky='w')

        # Create the navigation buttons and add them to the button frame
        Button(self.buttonFrame, text='Back', font=('Helvetica', 10),
               command=self.app.show_home_gui, width=10).grid(row=0,
                column=0)

        Button(self.buttonFrame, text='Export', font=('Helvetica', 10),
               command=self.export, width=10).grid(row=0,
                column=1)

        # Initialize sort column and direction variables
        self.sortColName = None
        self.sortDirection = False

        # Update the treeview with the comic book collection
        self.updateTreeview(self.app.bookCollection[1:])

        # Create dictionary to map column names to indices
        self.colIndex = {'Title': 0, 'Publisher': 1, 'Issue Number': 2}
        
        # Call sortCol with the default sort column
        self.sortCol(self.defaultSortCol)

    def updateTreeview(self, bookCollection):
        """
        Updates the treeview with the comic book collection.

        Args:
            - bookCollection: The comic book collection.

        Returns:
            - None
        """
        # Delete all entries in the treeview
        self.tree.delete(*self.tree.get_children())

        # Add the comic book collection to the treeview
        for book in bookCollection:
            # Insert the book into the treeview
            self.tree.insert('', 'end', values=book)

    def sortCol(self, col):
        """
        Sorts the entries in the treeview by the column that was clicked.

        Args:
            - col: The column that was clicked.

        Returns:
            - None
        """

        # Sort the comic book collection by the column that was clicked
        if self.sortColName == col:
            # If the same column header is clicked twice, sort in reverse
            self.sortDirection = not self.sortDirection
        else:
            # Sort in ascending order by default
            self.sortDirection = False
        # Update the sort column name
        self.sortColName = col
        # Update the treeview
        self.updateTreeview(sorted(self.app.bookCollection[1:], key=lambda x: x[self.colIndex[self.sortColName]], reverse=self.sortDirection))
        # Update column header style to indicate sorting direction
        for col_name in self.colIndex.keys():
            if col_name == col:
                if self.sortDirection:
                    self.tree.heading(col_name, text=col_name + " ▼")
                else:
                    self.tree.heading(col_name, text=col_name + " ▲")
            else:
                self.tree.heading(col_name, text=col_name)

    def export(self):
        """
        Exports the comic book collection to a PDF file.

        Args:
            - None

        Returns:
            - None
        """

        # Load the comic book collection
        self.app.load_collection

        # Create a new PDF file
        pdf = FPDF()

        # Add a page to the PDF
        pdf.add_page()

        # Set the format of the PDF
        page_width = pdf.w - 2 * pdf.l_margin

        # Set the font for the PDF title and add the Title to the PDF
        pdf.set_font('Times','B',14.0) 
        pdf.cell(page_width, 0.0, 'Comic Book Collection', align='C')
        pdf.ln(10)
    
        # Add indication of sort order to the PDF title and add the sort order to the PDF
        if self.sortDirection:
            sort_order = " (Sorted Descending)"
        else:
            sort_order = " (Sorted Ascending)"
        pdf.set_font('Times', 'B', 12)
        pdf.cell(page_width, 0.0, 'Sorted By: ' + self.sortColName + sort_order, align='C')
        pdf.ln(10)

        # Set the font for the table headers
        pdf.set_font('Courier', 'B', 12)
        col_width = page_width/4
    
        pdf.ln(1)
    
        th = pdf.font_size
    
        # Bold headers in the PDF
        pdf.set_font('Courier', 'B', 12)
        pdf.cell(col_width, th, 'Title', border=1)
        pdf.cell(col_width, th, 'Publisher', border=1)
        pdf.cell(col_width, th, 'Issue Number', border=1)
        pdf.ln(th)
    
        # Sort the collection based on the selected column and direction
        indices = range(1, len(self.app.bookCollection))
        sorted_indices = sorted(indices, key=lambda i: self.app.bookCollection[i][self.colIndex[self.sortColName]], reverse=self.sortDirection)
        sorted_collection = [self.app.bookCollection[i] for i in sorted_indices]
    
        # Populate the PDF with the sorted collection
        for book in sorted_collection:
            pdf.set_font('Courier', '', 12)
            pdf.cell(col_width, th, str(book[0]), border=1)
            pdf.cell(col_width, th, book[1], border=1)
            pdf.cell(col_width, th, book[2], border=1)
            pdf.ln(th)

        # set the default filename
        default_filename = 'collection.pdf'
        
        # get the current working directory
        cwd = os.getcwd()
        
        # show the file dialog and get the save path
        path = filedialog.asksaveasfile(initialdir=cwd, title="Save file",
                                        initialfile=default_filename,
                                        filetypes=(("pdf files", "*.pdf"),("all files", "*.*")))
        
        # save the PDF to the specified path if it is not None (i.e. the user did not cancel the save)
        if path is not None:
            pdf.output(name=path.name, dest='F')
            if path is not None:
                pdf.output(name=path.name, dest='F')

def main():
    """
    Main function.

    Args:
        - None

    Returns:
        - None
    """

    # Create the root window
    root = Tk()
    
    # Create an instance of the ComicCollectionApp class
    app = ComicCollectionApp(root)

    # Start the main loop of the application
    root.mainloop()

# Call the main function
if __name__ == '__main__':
    main()