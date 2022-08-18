/**
 * Required External Modules
 */

import { PrismaClient } from "@prisma/client"
import { Reimbursement, UpdatePayload } from "../types"
import * as dotenv from "dotenv"
import nodemailer from "nodemailer"

dotenv.config()
/**
 * Definte the service
 */

const prisma = new PrismaClient()

const sendEmail = (payload: {
    actionBy: string,
    department: string,
    roleTitle: string,
    email: string,
    status: string,
    crf: number,
    firstName: string
    reimbursements: Reimbursement[]
}) => {

    const actionBy = payload.actionBy
    const department = payload.department
    const roleTitle = payload.roleTitle
    const email = payload.email
    const status = payload.status
    const crf = payload.crf
    const firstName = payload.firstName
    const reimbursements = payload.reimbursements

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PW,
        }
    })

    let updatedDepartment = ''
    if (actionBy === 'director') {
        if (department === 'MA') {
            updatedDepartment = 'multimedia arts director'
        } else if (department === 'CS') {
            updatedDepartment = 'computer science director'
        } else if (department === 'IT') {
            updatedDepartment = 'information technology director'
        } else if (department === 'CpE') {
            updatedDepartment = 'computer engineering director'
        } else if (department === 'ME') {
            updatedDepartment = 'mechanical engineering director'
        } else if (department === 'CE') {
            updatedDepartment = 'civil engineering director'
        } else if (department === 'EE') {
            updatedDepartment = 'electronics and electrical engineering director'
        } else if (department === 'HSC') {
            updatedDepartment = 'humanities and social sciences director'
        } else if (department === 'MPS') {
            updatedDepartment = 'mathematics and physical sciences director'
        }
    } else if (actionBy === 'sdirector') {
        updatedDepartment = 'college of computer sciences senior director'
    } else if (actionBy === 'hsu') {
        updatedDepartment = 'health and services unit department'
    } else if (actionBy === 'hr') {
        updatedDepartment = 'human resources department'
    } else if (actionBy === 'sdas') {
        updatedDepartment = 'senior director for academic services'
    } else if (actionBy === 'finance') {
        updatedDepartment = 'finance department'
    }

    let reimbursementString = ''
    reimbursements.forEach(reimbursement => {
        reimbursementString += reimbursement.expenseNature
        if (reimbursement.approved) {
            reimbursementString += ' (Approved)'
        } else {
            reimbursementString += ' (Rejected)'
        }
        reimbursementString += '<br\/>'
    })
    const message = {
        financeActionBodyBefore: `Good day, finance department<br\/><br\/>This email will serve as an update to the ticket with CRF number ${crf}. ${firstName} must provide a hardcopy of the prescriptions within 7 days only. Otherwise, the ticket will not proceed and will automatically be rejected.<br\/><br\/><i>Please note that this is an auto-generated email. Please do not reply.<\/i><br\/><br\/>Thanks,<br\/>RNV e-support`,
        financeActionBodyAfter: `Good day, finance department<br\/><br\/>This will serve as an update to the ticket with CRF number ${crf}. By this time, ${firstName} has already provided a hardcopy of the prescriptions. Thet ticket is requiring your immediate action.<br\/><br\/>You can also login on our <a href='http://159.223.45.163'>website<\/a> for more information.<br\/><br\/><i>Please note that this is an auto-generated email. Please do not reply.<\/a><br\/><br\/>Thanks,<br\/>RNV e-support`,
        adminActionBody: `Good day, ${updatedDepartment}<br\/><br\/>This email is to inform you that the ticket with a CRF number of ${crf} is requiring your immediate action.<br\/><br\/>You can also visit and login on our <a href='http://159.223.45.163'>website<\/a> for more information.<br\/><br\/><i>Please note that this is an auto-generated email. Please do not reply</i><br\/><br\/>Thanks,<br\/>RNV e-support`,
        clientUpdateBody: `Good day, ${firstName}<br\/><br\/>Thank you for using the Online Reimbursement System. The ${updatedDepartment} is now currently working on your ticket with CRF number ${crf}. A list of information on the progress regarding your reimbursements will be shown below.<br\/><br\/>${reimbursementString}<br\/>You can also visit and login on our <a href='http://159.223.45.163'>website<\/a> for more information. Thank you for your patience.<br\/><br\/><i>Please note that this is an auto-generated email. Please do not reply.<\/i><br\/><br\/>Thanks,<br\/>RNV e-support`,
        clientCompletedBody: `Good day, ${firstName}<br\/><br\/>Thank you for using the Online Reimbursement System. Your ticket with CRF number ${crf} is now completed. You may now proceed to the Finance Department for verification of your Medical Reimbursement. A list of your reimbursements are shown below. ${reimbursementString}<br\/>You can also visit and login on our <a href='http://159.223.45.163'>website<\/a> for more information. Thank you for your patience.<br\/><br\/><i>Please note that this is an auto-generated email. Please do not reply.<\/i><br\/><br\/>Thanks,<br\/>RNV e-support`,
        clientRejectedBody: `Good day, ${firstName}<br\/><br\/>Thank you for using the Online Reimbursement System. Your ticket with CRF number ${crf} is rejected.<br\/><br\/>${reimbursementString}<br\/>You can also visit and login on our <a href='http://159.223.45.163'>website<\/a> for more information. Thank you for your patience.<br\/><br\/><i>Please note that this is an auto-generated email. Please do not reply.<\/i><br\/><br\/>Thanks,<br\/>RNV e-support`,
        clientActionBody: `Good day, ${firstName}<br\/><br\/>Thank you for using the Online Reimbursement System. Your ticket with CRF number ${crf} is still in progress. However, we kindly ask that you provide a <u>hard copy of the prescriptions<\/u> immediately. Please take note that you have only 7 days to provide the prescriptions to the Fiannce Department. Otherwise, your ticket will be automatically rejected.<br\/><br\/>Upon complying with the requirements, you may now proceed to our website.<br\/><br\/>Visit our <a href='http://159.223.45.163'>website<\/a>.<br\/>Verify your ticket on the \"Pending Ticket\" tab menu.<br\/>\"Click the box\" if you already complied with the requirements.<br\/>Click the \"save button.\"<br\/><br\/><i>Please note that this is an auto-generated email. Please do not reply.<\/i><br\/><br\/>Thanks,<br\/>RNV e-support`
    }

    const adminEmails: {
        director: {
            'MA': string,
            'CS': string,
            'IT': string,
            'CpE': string,
            'ME': string,
            'CE': string,
            'EE': string,
            'HSC': string,
            'MPS': string
        },
        sdirector: string,
        hsu: string,
        hr: string,
        sdas: string,
        finance: string
    } = {
        director: {
            'MA': 'feu.madirector@gmail.com',
            'CS': 'feu.csdirector@gmail.com',
            'IT': 'feu.itdirector@gmail.com',
            'CpE': 'feu.cpedirector@gmail.com',
            'ME': 'feu.medirector@gmail.com',
            'CE': 'feu.cedirector@gmail.com',
            'EE': 'feu.eedirector@gmail.com',
            'HSC': 'feu.hscdirector@gmail.com',
            'MPS': 'feu.mpsdirector@gmail.com',
        },
        sdirector: 'feu.ccsseniordirector@gmail.com',
        hsu: 'feu.hsunit@gmail.com',
        hr: 'feu.hresources@gmail.com',
        sdas: 'feu.sdas@gmail.com',
        finance: 'feu.finac@gmail.com'
    }

    let mailOptions = {
        from: process.env.EMAIL,
        to: '',
        subject: `Reimbursement ${crf} Update`,
        html: ''
    }

    if (actionBy === 'director') {
        if (department === 'MA') {
            mailOptions.to = adminEmails.director.MA
        } else if (department === 'CS') {
            mailOptions.to = adminEmails.director.CS
        } else if (department === 'IT') {
            mailOptions.to = adminEmails.director.IT
        } else if (department === 'CpE') {
            mailOptions.to = adminEmails.director.CpE
        } else if (department === 'ME') {
            mailOptions.to = adminEmails.director.ME
        } else if (department === 'CE') {
            mailOptions.to = adminEmails.director.CE
        } else if (department === 'EE') {
            mailOptions.to = adminEmails.director.EE
        } else if (department === 'HSC') {
            mailOptions.to = adminEmails.director.HSC
        } else if (department === 'MPS') {
            mailOptions.to = adminEmails.director.MPS
        }
    } else if (actionBy === 'sdirector') {
        mailOptions.to = adminEmails.sdirector
    } else if (actionBy === 'hsu') {
        mailOptions.to = adminEmails.hsu
    } else if (actionBy === 'hr') {
        mailOptions.to = adminEmails.hr
    } else if (actionBy === 'sdas') {
        mailOptions.to = adminEmails.sdas
    } else if (actionBy === 'user') {
        mailOptions.to = email
    } else if (actionBy === 'finance') {
        mailOptions.to = adminEmails.finance
    } else if (actionBy === 'none') {
        mailOptions.to = email
    }

    if (actionBy === 'none') {
        if (status.includes('Rejected')) {
            mailOptions.html = message.clientRejectedBody
        } else if (status === 'Completed') {
            mailOptions.html = message.clientCompletedBody
        }
    } else if (actionBy === 'user') {
        mailOptions.html = message.clientActionBody
    }


    if (actionBy === 'none' || actionBy === 'user') {
        transporter.sendMail(mailOptions, function (err, info) {
            if (err) {
                console.log(err)
            } else {
                console.log(info)
            }
        })
        if (actionBy === 'user') {
            mailOptions.html = message.financeActionBodyBefore
            mailOptions.to = adminEmails.finance
            transporter.sendMail(mailOptions, function (err, info) {
                if (err) {
                    console.log(err)
                } else {
                    console.log(info)
                }
            })
        }
    } else {
        if (actionBy === 'finance') {
            mailOptions.html = message.financeActionBodyAfter
            transporter.sendMail(mailOptions, function (err, info) {
                if (err) {
                    console.log(err)
                } else {
                    console.log(info)
                }
            })
        } else {
            mailOptions.html = message.adminActionBody
            transporter.sendMail(mailOptions, function (err, info) {
                if (err) {
                    console.log(err)
                } else {
                    console.log(info)
                }
            })
        }

        mailOptions.html = message.clientUpdateBody
        mailOptions.to = email
        transporter.sendMail(mailOptions, function (err, info) {
            if (err) {
                console.log(err)
            } else {
                console.log(info)
            }
        })
    }
}

export const updateTicket = async (payload: UpdatePayload) => {
    const userId = payload.userId
    const ticketId = payload.ticketId
    const crf = payload.crf
    const department = payload.department
    const email = payload.email
    const actionBy = payload.actionBy
    const status = payload.status
    const reimbursements = payload.reimbursements
    const remarks = payload.remarks
    const balance = payload.balance
    const updatedBalance = payload.updatedBalance

    // Update user balance
    if (updatedBalance) {
        await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                balance: updatedBalance
            }
        })
    }

    // Update base ticket actionby and status
    await prisma.ticket.update({
        where: {
            id: parseInt(ticketId)
        },
        data: {
            actionBy: actionBy,
            status: status
        }
    })

    let roleTitle = ''
    const roles = ['director', 'sdirector', 'hsu', 'hr', 'sdas', 'user', 'finance']
    const rolesTitleCase = ['director', 'senior director', 'HSU', 'HR', 'SDAS', 'user', 'finance']
    const roleIndex = roles.indexOf(actionBy)
    roleTitle = rolesTitleCase[roleIndex]

    const firstName = await prisma.user.findUnique({
        where: {
            id: userId
        },
        select: {
            firstName: true
        }
    })

    // Send email after ticket update 
    const emailPayload = {
        actionBy: actionBy,
        roleTitle: roleTitle,
        department: department,
        email: email,
        status: status,
        crf: crf,
        firstName: firstName?.firstName as string,
        reimbursements: reimbursements
    }

    sendEmail(emailPayload)

    // Update changes to reimbursements
    for (let i = 0; i < reimbursements.length; i++) {
        await prisma.reimbursement.update({
            where: {
                id: reimbursements[i].id
            },
            data: {
                approved: reimbursements[i].approved
            }
        })
    }

    // Create remarks 
    for (let i = 0; i < remarks.length; i++) {
        await prisma.remark.create({
            data: {
                ticket: { connect: { id: remarks[i].ticketId } },
                type: remarks[i].type,
                role: remarks[i].role,
                content: remarks[i].content
            }
        })
    }

    // Create balance for ticket
    if (balance) {
        await prisma.balance.create({
            data: {
                ticket: { connect: { id: balance.ticketId } },
                name: balance.name,
                balanceDate: balance.balanceDate,
                amount: balance.amount,
                preparedBy: balance.preparedBy
            }
        })
    }

    const ticket = await prisma.ticket.findUnique({
        where: {
            id: parseInt(ticketId)
        },
        include: {
            remarks: true,
            reimbursements: true
        }
    })

    prisma.$disconnect()
    return ticket
}
