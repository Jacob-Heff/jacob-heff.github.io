import csv
from tkinter import Tk, Frame, Label, Button, Entry, Scrollbar, filedialog
from tkinter import ttk
from fpdf import FPDF
import os


class ComicCollectionApp:
    """
    A class representing a GUI application for managing a collection of comic books.
    """
    def __init__(self, master):
        """
        Initializes a new instance of the ComicCollectionApp class.

        Args:
        - master: the master Tkinter window

        Returns:
        - None
        """

        self.master = master
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

        print(x)
        print(y)

        # Set the position of the window to the center of the screen
        self.master.geometry(f'{width}x{height}+{x}+{y}')

        # Create a frame for the GUI

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

        try:
            with open('collection.csv', 'r') as csvFile:
                reader = csv.reader(csvFile, delimiter=',')
                # Check if the file has headers and if they match the book collection headers
                try:
                    headers = next(reader)
                    if headers == self.bookCollection[0]:
                        for row in reader:
                            if row not in self.bookCollection:
                                self.bookCollection.append(row)
                except StopIteration:
                    self.save_collection()
        except FileNotFoundError:
            # If the file is not found, create a new file
            self.save_collection()

    def save_collection(self):
        """
        Saves the comic book collection to a CSV file.

        Args:
        - None

        Returns:
        - None
        """

        with open('collection.csv', 'w') as csvFile:
            writer = csv.writer(csvFile, delimiter=',')
            writer.writerows(self.bookCollection)

    def clear_frame(self):
        """
        Clears the contents of the GUI frame.

        Args:
        - None

        Returns:
        - None
        """

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

        self.clear_frame()
        self.homeGui.display()

    def show_view_gui(self):
        """
        Displays the view GUI view.

        Args:
        - None

        Returns:
        - None
        """

        self.clear_frame()
        self.viewGui.display()

    def show_add_gui(self):
        """
        Displays the add GUI view.

        Args:
        - None

        Returns:
        - None
        """

        self.clear_frame()
        self.addGui.display()

    def show_remove_gui(self):
        """
        Displays the remove GUI view.

        Args:
        - None

        Returns:
        - None
        """

        self.clear_frame()
        self.removeGui.display()


class HomeGUI:
    """
    A class representing the home GUI view of the ComicCollectionApp application.
    """

    def __init__(self, app):
        """
        Initializes a new instance of the HomeGUI class.

        Args:
        - app: an instance of the ComicCollectionApp class

        Returns:
        - None
        """

        self.app = app

    def display(self):
        """
        Creates and displays the widgets for the home GUI view.

        Args:
        - None

        Returns:
        - None
        """

        self.app.master.title('Comic Book Collection Manager - Home')
        Label(self.app.mainFrame, width=25).grid(column=0, row=0)

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
    A class representing the add entry GUI view of the ComicCollectionApp application.
    """

    def __init__(self, app):
        """
    Initializes a new instance of the AddEntryGUI class.

    Args:
      - app: an instance of the ComicCollectionApp class

    Returns:
      - None
    """

        self.app = app

    def display(self):
        """
    Creates and displays the widgets for the add entry GUI view.

    Args:
      - None

    Returns:
      - None
    """
        self.app.master.title('Comic Book Collection Manager - Add Entry')
        Label(self.app.mainFrame, width=20).grid(column=0, row=0)
        Label(self.app.mainFrame, width=20).grid(column=1, row=0)

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


        self.buttonFrame = Frame(self.app.mainFrame)
        self.buttonFrame.grid(row=4, column=1, pady=10, sticky='w')

        Button(self.buttonFrame, text='Back', font=('Helvetica', 10),
               command=self.app.show_home_gui, width=10).grid(row=0,
                column=0)

        Button(self.buttonFrame, text='Add', command=self.add_entry,
               width=10).grid(row=0, column=1)
      
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

        title = self.titleEntry.get()
        publisher = self.publisherEntry.get()
        issueNumber = self.issueNumberEntry.get()

        if title and publisher and issueNumber:
            if [title, publisher, issueNumber] \
                not in self.app.bookCollection:
                self.app.bookCollection.append([title, publisher,
                        issueNumber])
                self.app.save_collection()
                self.titleEntry.delete(0, 'end')
                self.publisherEntry.delete(0, 'end')
                self.issueNumberEntry.delete(0, 'end')
                self.warningLabel.config(text='Entry added successfully.'
                        )
            else:
                self.warningLabel.config(text='This entry already exists.'
                        )
        else:
            self.warningLabel.config(text='Please fill in all fields.')


class RemoveEntryGUI:

    def __init__(self, app):
        self.app = app

    def display(self):
        """
    Creates and displays the widgets for the add entry GUI view.

    Args:
      - None

    Returns:
      - None
    """
        self.app.master.title('Comic Book Collection Manager - Remove Entry')
        Label(self.app.mainFrame, width=20).grid(column=0, row=0)
        Label(self.app.mainFrame, width=20).grid(column=1, row=0)

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


        self.buttonFrame = Frame(self.app.mainFrame)
        self.buttonFrame.grid(row=4, column=1, pady=10, sticky='w')

        Button(self.buttonFrame, text='Back', font=('Helvetica', 10),
               command=self.app.show_home_gui, width=10).grid(row=0,
                column=0)

        Button(self.buttonFrame, text='Remove', command=self.remove_entry,
               width=10).grid(row=0, column=1)

        self.warningLabel = Label(self.app.mainFrame, text='', fg='red'
                                   )
        self.warningLabel.grid(row=5, column=1, padx=10,
                pady=10, sticky='w')

    def remove_entry(self):
        title = self.titleEntry.get()
        publisher = self.publisherEntry.get()
        issueNumber = self.issueNumberEntry.get()

        if title and publisher and issueNumber:
            entry_to_remove = [title, publisher, issueNumber]
            if entry_to_remove in self.app.bookCollection:
                self.app.bookCollection.remove(entry_to_remove)
                self.app.save_collection()
                self.titleEntry.delete(0, 'end')
                self.publisherEntry.delete(0, 'end')
                self.issueNumberEntry.delete(0, 'end')
                self.warningLabel.config(text='Entry removed successfully.'
                        )
            else:
                self.warningLabel.config(text='Entry not found.')
        else:
            self.warningLabel.config(text='Please fill in all fields.')


class ViewGUI:

    def __init__(self, app):
        self.app = app
        self.defaultSortCol = 'Title' 

    def display(self):
        self.app.master.title('Comic Book Collection Manager - View Entries')
        self.tree = ttk.Treeview(self.app.mainFrame, columns=('Title', 'Publisher', 'Issue Number'),
                                 show='headings', height=5)
        self.tree.heading('Title', text='Title', command=lambda col='Title': self.sortCol(col))
        self.tree.heading('Publisher', text='Publisher', command=lambda col='Publisher': self.sortCol(col))
        self.tree.heading('Issue Number', text='Issue Number', command=lambda col='Issue Number': self.sortCol(col))
        self.tree.grid(row=2, column=0, columnspan=3, pady=10)

        self.scrollbar = Scrollbar(self.app.mainFrame, orient='vertical',
                                   command=self.tree.yview)
        self.scrollbar.grid(row=2, column=3, sticky='ns')

        self.tree.configure(yscrollcommand=self.scrollbar.set)

        self.buttonFrame = Frame(self.app.mainFrame)
        self.buttonFrame.grid(row=6, column=1, pady=10, sticky='w')

        Button(self.buttonFrame, text='Back', font=('Helvetica', 10),
               command=self.app.show_home_gui, width=10).grid(row=0,
                column=0)

        Button(self.buttonFrame, text='Export', font=('Helvetica', 10),
               command=self.export, width=10).grid(row=0,
                column=1)

        # Initialize sort column and direction variables
        self.sortColName = None
        self.sortDirection = False

        self.updateTreeview(self.app.bookCollection[1:])

        # Create dictionary to map column names to indices
        self.colIndex = {'Title': 0, 'Publisher': 1, 'Issue Number': 2}
        
        # Call sortCol with the default sort column
        self.sortCol(self.defaultSortCol)

    def updateTreeview(self, bookCollection):
        self.tree.delete(*self.tree.get_children())
        for book in bookCollection:
            self.tree.insert('', 'end', values=book)

    def sortCol(self, col):
        if self.sortColName == col:
            # If the same column header is clicked twice, sort in reverse
            self.sortDirection = not self.sortDirection
        else:
            # Sort in ascending order by default
            self.sortDirection = False
        self.sortColName = col
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
        self.app.load_collection
        pdf = FPDF()
        pdf.add_page()
        page_width = pdf.w - 2 * pdf.l_margin
        pdf.set_font('Times','B',14.0) 
        pdf.cell(page_width, 0.0, 'Comic Book Collection', align='C')
        pdf.ln(10)
    
        # Add indication of sort order to the PDF title
        if self.sortDirection:
            sort_order = " (Sorted Descending)"
        else:
            sort_order = " (Sorted Ascending)"
        pdf.set_font('Times', 'B', 12)
        pdf.cell(page_width, 0.0, 'Sorted By: ' + self.sortColName + sort_order, align='C')
        pdf.ln(10)
    
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
        
        if path is not None:
            pdf.output(name=path.name, dest='F')
            if path is not None:
                pdf.output(name=path.name, dest='F')
      
def main():
    root = Tk()
    app = ComicCollectionApp(root)
    root.mainloop()


if __name__ == '__main__':
    main()