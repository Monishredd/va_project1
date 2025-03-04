$(document).ready(function() {
    loadDocumentIDs();
    $('#show-documents').on('click', displaySelectedDocuments);
    enableDragAndDrop();
});

function loadDocumentIDs() {
    const agencies = {
        'CIA': 43,
        'DIA': 3,
        'FBI': 41,
        'NSA': 22,
        'USCBP': 2
    };

    Object.keys(agencies).forEach(agency => {
        for (let i = 1; i <= agencies[agency]; i++) {
            let docId = `${agency}_${i.toString().padStart(2, '0')}`;
            addDocumentToList(docId);
        }
    });
}

function addDocumentToList(id) {
    const listItem = $('<li>', {
        id: `doc-${id}`,
        text: id,
        class: 'list-group-item doc-item',
        click: function() { toggleDocumentSelection(id, $(this)); }
    }).appendTo('#document-list');
}

function toggleDocumentSelection(documentId, listItem) {
    listItem.toggleClass('selected');
    if (listItem.hasClass('selected')) {
        localStorage.setItem(documentId, ''); // Placeholder for content to be fetched
    } else {
        localStorage.removeItem(documentId); // Remove if unselected
    }
}

function displaySelectedDocuments() {
    const workspace = $('#document-content');
    workspace.empty(); // Clear previous content
    $('.doc-item.selected').each(function() {
        const documentId = $(this).text();
        displayDynamicDocument(documentId);
    });
}

async function displayDynamicDocument(documentId) {
    const content = localStorage.getItem(documentId);
    if (content) {
        displayDocumentContent(documentId, content);
    } else {
        const url = `http://localhost:3000/dataset/${documentId}`;
        try {
            const response = await fetch(url);
            const data = await response.text();
            localStorage.setItem(documentId, data); // Save fetched content to localStorage
            displayDocumentContent(documentId, data);
        } catch (error) {
            displayDocumentContent(documentId, 'Failed to load document.');
        }
    }
}

function displayDocumentContent(documentId, content) {
    console.log(`Displaying document: ${content}`);
    const contentDiv = $(`<div id="content-${documentId}" class="draggable-document" draggable="true">`).html(`<h3>${documentId}</h3><p>${content}</p>`);
    $('#document-content').append(contentDiv);
}

function enableDragAndDrop() {
    $(document).on('dragstart', '.draggable-document', function(event) {
        event.originalEvent.dataTransfer.setData('text/plain', event.target.id);
        $(this).addClass('dragging');
    });

    $(document).on('dragend', '.draggable-document', function() {
        $(this).removeClass('dragging');
    });

    $('#document-content').on('dragover', function(event) {
        event.preventDefault();
    });

    $('#document-content').on('drop', function(event) {
        event.preventDefault();
        const id = event.originalEvent.dataTransfer.getData('text/plain');
        const element = document.getElementById(id);
        if (element) {
            $(this).append(element);
        }
    });
}