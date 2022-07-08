let triggerBtn = document.querySelectorAll('.trigger-btn');
let closeBtns = document.querySelectorAll('.close-modal');
let dialog = document.querySelector('dialog');
let modals = document.querySelectorAll('dialog');
let content = document.querySelector('.content-wrapper');

const closeModal = (e) => {
    let closestDialog = e.target.closest('dialog');
    // Animate closing modals
    closestDialog.setAttribute('hiding', '');
    closestDialog.addEventListener('animationend', () => {
        closestDialog.close();
        closestDialog.removeAttribute('hiding');
    }, {
        once: true
    })
}

// if (typeof dialog.showModal !== 'function') {
//   modals.hidden === true;
//   console.error('Update your browser for a more interactive experience');
// }

modals.forEach((modal) => {
    if (typeof dialog.showModal === "function") {

        triggerBtn.forEach(trigger => {
            trigger.addEventListener('click', (e) => {

                // if trigger's data-modal maches modal's id, open that one
                if (e.target.getAttribute('data-modal') === modal.getAttribute('id')) {
                    modal.setAttribute('showing', '');
                    modal.showModal();
                    modal.addEventListener('animationend', () => {
                        modal.removeAttribute('showing');
                    }, {
                        once: true
                    })
                }

            })
        });

        // Close modals
        closeBtns.forEach(button => {
            button.addEventListener('click', (e) => {
                closeModal(e);
            });
        });
        // Close modal w/ backdrop
        modal.addEventListener('click', (e) => {
            if (e.target.nodeName === 'DIALOG') {
                closeModal(e);
            }
        })

        modal.addEventListener('keydown', (e) => {
            if ((e.key == 'Escape' || e.key == 'Esc' || e.code == 27)) {
                closeModal(e);

            }
        })
    } else {
        // TODO If a browser doesn't support the dialog, then hide the
        // dialog contents by default and add content modal content to div
        console.warn('Update your browser for a more interactive experience');
        modal.hidden = true; //  delete instead of hiding them

    }

})