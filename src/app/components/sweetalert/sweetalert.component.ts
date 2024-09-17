import { Component, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import swal from 'sweetalert2';

declare var $: any;

@Injectable({
  providedIn: "root",
})
@Component({
  selector: 'sweetalert-cmp',
  templateUrl: 'sweetalert.component.html'
})

export class SweetAlertComponent {
  constructor(
    private router: Router,
  ) {}

  showSwal(type, title = '', message = '') {
    if (type == 'basic') {
      return swal.fire({
        title: "Here's a message!",
        buttonsStyling: false,
        customClass: {
          confirmButton: "btn btn-fill btn-success"
        }
      })

    } else if (type == 'title-and-text') {
      return swal.fire({
        title: "Here's a message!",
        text: "It's pretty, isn't it?",
        buttonsStyling: false,
        customClass: {
          confirmButton: "btn btn-fill btn-info"
        }
      })

    } else if (type == 'success-message') {
      return swal.fire({
        title: title,
        text: message,
        buttonsStyling: false,
        customClass: {
          confirmButton: "btn btn-fill btn-success",
        },
        icon: "success"
      })

    } else if (type == 'password-changed') {
      return swal.fire({
        title: "Successfull!",
        text: "Password updated successfully",
        buttonsStyling: false,
        customClass: {
          confirmButton: "btn btn-fill btn-success",
        },
        icon: "success"
      }).then((result) => {
        this.router.navigate(['/home']).then(() => { });
      });
    }

    else if (type == 'support-success') {
      return swal.fire({
        title: "Thank you!",
        text: "Thanks for reaching out. One of the Agent from Customer Service team will get back on your request.",
        buttonsStyling: false,
        customClass: {
          confirmButton: "btn btn-fill btn-success",
        },
        icon: "success"
      })
    }
   else if (type == 'money-code-success') {
    return swal.fire({
      title: "Thank you!",
      text: "Thanks for reaching out. One of the Agent from Customer Service team will get back on your request.",
      buttonsStyling: false,
      customClass: {
        confirmButton: "btn btn-fill btn-success",
      },
      icon: "success"
    })
  }
    else if (type == 'warning-message-and-confirmation') {
      return swal.fire({
        title: 'Are you sure?',
        text: "You will not be able to recover this imaginary file!",
        icon: 'warning',
        showCancelButton: true,
        customClass: {
          confirmButton: 'btn btn-fill btn-success btn-mr-5',
          cancelButton: 'btn btn-fill btn-danger',
        },
        confirmButtonText: 'Yes, delete it!',
        buttonsStyling: false,

      }).then((result) => {
        if (result.value) {
          return swal.fire(
            {
              title: 'Deleted!',
              text: 'Your imaginary file has been deleted.',
              icon: 'success',
              customClass: {
                confirmButton: "btn btn-fill btn-success",
              },
              buttonsStyling: false
            }
          )
        }
      })

    } else if (type == 'warning-message-and-cancel') {
      return swal.fire({
        title: 'Are you sure?',
        text: 'You will not be able to recover this imaginary file!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, keep it',
        customClass: {
          confirmButton: "btn btn-fill btn-success btn-mr-5",
          cancelButton: "btn btn-fill btn-danger",
        },
        buttonsStyling: false
      }).then((result) => {
        if (result.value) {
          return swal.fire({
            title: 'Deleted!',
            text: 'Your imaginary file has been deleted.',
            icon: 'success',
            customClass: {
              confirmButton: "btn btn-fill btn-success",
            },
            buttonsStyling: false
          })
        } else {
          return swal.fire({
            title: 'Cancelled',
            text: 'Your imaginary file is safe :)',
            icon: 'error',
            customClass: {
              confirmButton: "btn btn-fill btn-info",
            },
            buttonsStyling: false
          })
        }
      })
    } else if (type == 'custom-html') {
      return swal.fire({
        title: 'HTML example',
        buttonsStyling: false,
        customClass: {
          confirmButton: "btn btn-fill btn-success",
        },
        html: 'You can use <b>bold text</b>, ' +
          '<a href="https://github.com">links</a> ' +
          'and other HTML tags'
      })

    } else if (type == 'auto-close') {
      return swal.fire({
        title: "Auto close alert!",
        text: "I will close in 2 seconds.",
        timer: 2000,
        showConfirmButton: false
      })
    } else if (type == 'input-field') {
      return swal.fire({
        title: 'Input something',
        html: '<div class="form-group">' +
          '<input id="input-field" type="text" class="form-control" />' +
          '</div>',
        showCancelButton: true,
        customClass: {
          confirmButton: 'btn btn-fill btn-success btn-mr-5',
          cancelButton: 'btn btn-fill btn-danger',
        },
        buttonsStyling: false
      }).then((result) => {
        if (result.value) {
          return swal.fire({
            icon: 'success',
            html: 'You entered: <strong>' +
              $('#input-field').val() +
              '</strong>',
            customClass: {
              confirmButton: 'btn btn-fill btn-success',
            },
            buttonsStyling: false

          })
        }
      })
    } else if(type === 'error-response'){
      return swal.fire({
        title: title,
        text: message,
        customClass: {
          confirmButton: "btn btn-fill btn-success",
          title: "text-danger",
        },
        icon: "error",
      });
    }
  }
}
