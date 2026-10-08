# TideLedger – Fisheries Resource Management System

## Software Requirements Specification (SRS)

### Version 1.0

---

# 1. DOCUMENT INFORMATION

Project Name: TideLedger – Fisheries Resource Management System

Course: U23IT481 – Software Engineering Laboratory

Version: 1.0

Date: 06 October 2026

Prepared By: [Team Members]

Faculty Guide: [Guide Name]

---

# 2. INTRODUCTION

## 2.1 Purpose

This document specifies the software requirements for TideLedger, a fisheries resource management system designed to digitize and verify the complete lifecycle of catch reporting, compliance monitoring, traceability, and fisher-to-buyer transactions. The system shall support operational transparency, catch credibility assessment, sustainability analytics, and government oversight while remaining centered on the needs of fishers, buyers, regulatory agencies, and administrators.

The purpose of TideLedger is to replace fragmented and manual fishery record-keeping with a single auditable digital platform. The system shall help users maintain trustworthy catch records, enforce quota rules, monitor seasonal and zonal restrictions, identify compliance violations, assess the transparency and plausibility of catches using an explainable rule-based trust model, and ensure product traceability from catch to sale.

## 2.2 Scope

The scope of TideLedger includes the complete operational cycle of fisheries management, from user registration and licence validation to catch logging, quota enforcement, compliance review, QR traceability, marketplace transactions, analytics, and reporting. TideLedger shall be a complete fisheries resource management platform that supports both field operations and administrative oversight.

In scope, the system shall support:
- digital catch reporting,
- quota compliance enforcement,
- restricted-zone and seasonal violation detection,
- seafood traceability,
- buyer confidence through transparent provenance data,
- direct fisher-to-buyer transaction support,
- sustainability-oriented analytics,
- explainable catch credibility assessment,
- fisher safety alerts and notifications,
- auditable catch-to-sale records,
- multilingual English/Tamil access,
- offline synchronization for field operations.

The system shall not be a generic marketplace, a blockchain implementation, or a biological stock prediction engine. It shall remain an operational fisheries management ecosystem focused on resource accountability, compliance, and trust.

## 2.3 Intended Audience

This SRS is intended for:
- evaluation panels and academic reviewers,
- project guides and faculty mentors,
- developers and testers,
- database and system designers,
- fisheries data reviewers and government staff,
- platform administrators,
- future maintainers of the project.

This document describes the required system behavior in a formal academic style and is intended to serve as the authoritative specification for what the system must do.

## 2.4 Product Overview

TideLedger is a fisheries resource management platform that digitizes fishery operations and provides transparent, auditable oversight of the catch lifecycle. It is designed for the following core categories of users:
- Fisher
- Buyer/Vendor
- Government/Admin
- System Administrator

The platform shall support every major stage of fisheries value flow:
1. registration and approval,
2. licence validation,
3. catch logging,
4. quota and zone monitoring,
5. compliance review,
6. trust score generation,
7. traceability and QR access,
8. marketplace interaction,
9. sales record management,
10. analytics and sustainability reporting.

The central innovation is the Explainable Catch Trust Engine. Every catch batch shall receive a Trust Score between 0 and 100 based on transparent, configurable, rule-based validation checks. The system shall explain why the score was assigned by showing the rules applied, the results of those rules, and the associated warnings or violations. This trust scoring mechanism shall be known as the Explainable Rule-Based Trust Engine.

The system shall also include a Resource Pressure Indicator that evaluates operational pressure across zones, species, and time periods based on recorded catch pressure, quota utilization, and configured sustainability thresholds. This indicator shall be an operational sustainability signal and shall not be treated as a direct biological stock measurement.

## 2.5 Document Conventions

The following conventions apply throughout this document:
- Functional requirements are identified in the format FR-MODULE-NUMBER.
- Examples include: FR-AUTH-01, FR-CATCH-01, FR-QUOTA-01, FR-ZONE-01, FR-COMPLIANCE-01, FR-TRUST-01, FR-TRACE-01, FR-MARKET-01, FR-ORDER-01, FR-ANALYTICS-01, FR-PRESSURE-01, FR-ALERT-01, FR-USER-01, FR-REPORT-01, and FR-AUDIT-01.
- The word “shall” indicates a mandatory requirement.
- The word “may” indicates optional or future behavior.
- The document describes what the system must do, not how it should be implemented in code.

## 2.6 References

This document follows the general structure and principles of:
- IEEE 830-1998: Recommended Practice for Software Requirements Specifications
- ISO/IEC/IEEE 29148: Systems and Software Engineering – Life Cycle Processes – Requirements Engineering
- Fisheries resource management and compliance standards typically used in digital catch recording and quota enforcement
- The approved Fisheries Resource Management System specification for the TideLedger solution

## 2.7 Definitions and Acronyms

- TideLedger: The fisheries resource management platform defined in this SRS.
- Fisher: A registered user who logs catches and may sell seafood.
- Buyer/Vendor: A registered user who purchases seafood from fishers or participates in the marketplace.
- Government/Admin: A regulatory or administrative user responsible for monitoring compliance and fisheries oversight.
- System Administrator: A technical and platform administrator responsible for user and configuration management.
- RBAC: Role-Based Access Control.
- GPS: Global Positioning System.
- QR Traceability: Record linking using quick-response code technology.
- Trust Score: The credibility score assigned to each catch batch, ranging from 0 to 100.
- Explainable Rule-Based Trust Engine: A transparent score generation system based on human-understandable validation rules.
- Resource Pressure Indicator: A zone/species/time indicator representing operational pressure and quota-based sustainability stress.
- Compliance Engine: The module that evaluates zone, quota, seasonal, and licence compliance.
- Catch Batch: A grouped recorded unit of harvested fish associated with a fisher, species, zone, and timestamp.
- Audit Log: A chronology of user actions, approvals, and system events.
- PWA: Progressive Web Application.

---

# 3. OVERALL DESCRIPTION

## 3.1 Product Perspective

TideLedger shall act as a centralized digital platform for fisheries resource management across all participating actors. It shall integrate field-level catch reporting, compliance enforcement, administrative review, risk monitoring, and trade transparency into one operational system.

The product is intended to replace paper-based record systems, inconsistent digital spreadsheets, and fragmented manual reporting. Instead of isolated recordkeeping, the system shall offer a single, auditable digital workflow covering catch generation, validation, quota tracking, verification, and sales transparency.

The product shall be designed as a secure, web-based platform with mobile-friendly access for fishers in field environments and administrative dashboards for regulators and platform managers. It shall support both English and Tamil interfaces, provide alert notifications, and enable offline synchronization for areas with inconsistent connectivity.

## 3.2 Product Functions

The major functions of TideLedger shall include:
- authentication and user lifecycle management,
- role-based access control,
- fisher and buyer management,
- fisher licence verification,
- catch recording with GPS and optional photo evidence,
- quota tracking and threshold alerts,
- fishing zone and season validation,
- compliance verification,
- Explainable Rule-Based Trust Engine evaluation,
- QR-based traceability records,
- marketplace listing and order management,
- price history tracking,
- sustainability and operational analytics,
- weather and compliance alerts,
- audit logging and reporting,
- offline synchronization and localized access.

## 3.3 User Classes and Characteristics

### 3.3.1 Fisher
Fishers shall be primary field users who record catches, view quota status, receive alerts, submit compliance-related data, and potentially list their seafood for sale. They shall require an easy-to-use mobile-friendly interface and reliable support for field conditions.

### 3.3.2 Buyer/Vendor
Buyers and vendors shall purchase seafood, review product provenance, compare prices, and validate trust and traceability records before finalizing transactions. They shall require transparency and confidence in the catch history and compliance record.

### 3.3.3 Government/Admin
Government and administrative users shall monitor compliance, licence validity, quota risk, violation records, and sustainability indicators. They shall need role-specific dashboards and report-generation capabilities.

### 3.3.4 System Administrator
System administrators shall manage platform access, role assignments, system configuration, approval workflows, and technical security operations. They shall be responsible for ensuring the integrity and continuity of the digital platform.

## 3.4 Operating Environment

TideLedger shall operate in a web-based environment using modern browsers and responsive devices, including desktop and mobile platforms. The system shall support internet connectivity where available and offline synchronization when connectivity is weak or absent.

It shall be designed for operational use in coastal or on-site fisheries environments where mobile devices are common and connectivity may be intermittent.

## 3.5 User Environment

Expected user environments include:
- fisher field settings during fishing operations,
- market or landing site buyer environments,
- administrative office environments for compliance monitoring,
- technical operations rooms used by platform administrators.

The system shall be usable in environments with limited bandwidth, high variability in connectivity, and multilingual use cases.

## 3.6 Design Constraints

TideLedger shall comply with the following design constraints:
- It shall be a fisheries resource management platform, not a generic e-commerce platform.
- It shall not use blockchain unless explicitly required in a future change request.
- It shall not replace the Trust Engine with generic AI-based decision making.
- It shall remain explainable, auditable, and rule-driven.
- It shall support secure role-based access.
- It shall maintain a detailed audit trail for important actions.
- It shall support English and Tamil interfaces.
- It shall support offline-first operational behavior for field users.

## 3.7 Assumptions and Dependencies

The following assumptions apply to the system:
- registered users may belong to different roles and shall be assigned role-based permissions,
- each fisher may have one or more licences and associated statuses,
- species, zones, quotas, and seasonal rules are configured by administrators,
- GPS coordinates may be recorded from a device or manually entered,
- network connectivity may be intermittent in remote fishing regions,
- reports and analytics rely on valid historical records.

Dependencies include:
- access to validated user identities,
- configured species and fishing-zone metadata,
- administrative approval workflows,
- secure session management,
- map and weather integrations,
- reporting and audit infrastructure.

## 3.8 System Boundaries

The system boundary shall include:
- authentication and access control,
- fisher and buyer profile management,
- licence verification,
- catch logging and validation,
- quota and zone compliance,
- trust evaluation,
- QR-based traceability,
- buyer and market functionality,
- analytics and reporting,
- weather alerts, notifications, and audit functions.

The system shall exclude or defer the following non-core functions:
- direct biological stock measurement,
- native mobile application development as a core requirement,
- IoT aquaculture monitoring,
- advanced ML stock prediction,
- government live API integration as a mandatory in-scope feature,
- additional language support beyond English and Tamil,
- advanced forecasting beyond sustainability monitoring.

---

# 4. SPECIFIC REQUIREMENTS

## 4.1 In-Scope Modules

The following modules are in scope:
- Authentication
- RBAC
- Fisher management
- Buyer management
- Licence verification
- Catch logging
- GPS capture
- Quota management
- Fishing zones
- Compliance engine
- Trust Engine
- QR traceability
- Marketplace
- Orders
- Price history
- Analytics
- Resource Pressure Indicator
- Weather alerts
- Notifications
- Violations
- Admin review
- Audit logs
- Reports
- Offline synchronization
- English/Tamil localization

## 4.2 Out-of-Scope / Future Scope

The following are not part of the initial scope and constitute future or extended scope:
- IoT aquaculture monitoring
- Advanced ML stock prediction
- Government live APIs
- Native mobile applications
- Additional languages beyond English and Tamil
- Advanced forecasting systems beyond operational sustainability indicators

## 4.3 Functional Requirements

### 4.3.1 Authentication and User Management

#### FR-AUTH-01

- Requirement ID: FR-AUTH-01
- Requirement: User Registration
- Priority: High
- Description: The system shall allow a new user to register an account as a fisher, buyer/vendor, government/admin, or system administrator according to the approved role model.
- Input: full name, contact information, email or mobile number, role, password, optional profile metadata.
- Processing: The system shall validate required fields, ensure unique identity values, enforce password policies, and create a user record with the selected role and default account state.
- Expected Output: successful registration confirmation, role assignment, account creation status.
- Preconditions: the user has access to the registration interface and the required fields are provided.
- Postconditions: the new account is created and the user may proceed to login or await approval.

#### FR-AUTH-02

- Requirement ID: FR-AUTH-02
- Requirement: User Login
- Priority: High
- Description: The system shall authenticate registered users using valid credentials and grant access only to authorized functions.
- Input: username or email/mobile identifier, password.
- Processing: The system shall verify user identity and account status, validate the password, and create a secure authenticated session.
- Expected Output: login success or failure with role-based access to the dashboard or module.
- Preconditions: user account exists and is active.
- Postconditions: the authenticated user is redirected to the role-appropriate interface.

#### FR-AUTH-03

- Requirement ID: FR-AUTH-03
- Requirement: User Logout
- Priority: High
- Description: The system shall allow a user to terminate an active session securely.
- Input: logout action from the active session.
- Processing: The system shall invalidate the session token and clear session state.
- Expected Output: session termination confirmation and redirect to the login page.
- Preconditions: the user is currently authenticated.
- Postconditions: the user is logged out and cannot access protected resources without re-authentication.

#### FR-AUTH-04

- Requirement ID: FR-AUTH-04
- Requirement: Password Security
- Priority: High
- Description: The system shall enforce secure password handling and protect stored credentials against unauthorized access.
- Input: password on registration, password change, or recovery.
- Processing: The system shall enforce password policies, hash passwords using a secure mechanism, and handle resets securely.
- Expected Output: accepted or rejected password, secure password storage, recovery workflow.
- Preconditions: user account is created or existing.
- Postconditions: credentials remain protected and usable only through authorized access flow.

#### FR-AUTH-05

- Requirement ID: FR-AUTH-05
- Requirement: Role Assignment and RBAC
- Priority: High
- Description: The system shall assign user roles and enforce access restrictions using role-based permission rules.
- Input: assigned role, protected resource action, user session.
- Processing: The system shall check the user's permission set before allowing access to specific modules or actions.
- Expected Output: access granted or denied based on permission.
- Preconditions: the role exists and the user is authenticated.
- Postconditions: only authorized users can perform restricted actions.

#### FR-USER-01

- Requirement ID: FR-USER-01
- Requirement: Account Status and Approval Workflow
- Priority: High
- Description: The system shall maintain a valid account status for each user and support approval workflows for regulated accounts.
- Input: user account, approval request, admin decision.
- Processing: The system shall assign and update account states such as pending, active, rejected, suspended, or approved.
- Expected Output: updated account status and user notification.
- Preconditions: account exists and role may require approval.
- Postconditions: access is granted or restricted according to final approval status.

#### FR-USER-02

- Requirement ID: FR-USER-02
- Requirement: Profile Management
- Priority: Medium
- Description: The system shall allow users to manage their account profile while preserving regulated identity and verification data.
- Input: personal details, contact information, preferences, language selection, profile metadata.
- Processing: The system shall update permitted fields while preventing unauthorized modification of identity or approval-related information.
- Expected Output: updated profile view and audit history.
- Preconditions: user is authenticated and authorized to edit their profile.
- Postconditions: the user profile reflects the latest authorized record.

#### FR-LICENSE-01

- Requirement ID: FR-LICENSE-01
- Requirement: Fisher Licence Verification and Approval
- Priority: High
- Description: The system shall store fisher licence information, verify validity against defined periods, and support approval or rejection by administrators.
- Input: licence number, issue date, expiry date, fisher identity, supporting document references.
- Processing: The system shall validate expiry periods, verify identity linkage, and flag invalid or expired licences.
- Expected Output: licence validity state and approval result.
- Preconditions: fisher account exists and licence information is available.
- Postconditions: catch and trading operations can be restricted based on licence validity.

### 4.3.2 Catch Logging and Validation

#### FR-CATCH-01

- Requirement ID: FR-CATCH-01
- Requirement: Catch Logging
- Priority: High
- Description: The system shall allow a fisher to record each catch batch with required details and generate a unique catch batch ID.
- Input: species, quantity, date/time, GPS, zone, optional photo, batch ID, catch notes.
- Processing: The system shall validate mandatory fields, store the record, and assign an auditable catch batch identifier.
- Expected Output: stored catch record with assigned batch ID and status.
- Preconditions: fisher is authenticated and approved, and required metadata is available.
- Postconditions: the catch is available for validation, reporting, and traceability.

#### FR-CATCH-02

- Requirement ID: FR-CATCH-02
- Requirement: Catch Validation and Status Tracking
- Priority: High
- Description: The system shall validate catch entries against compliance rules and assign a status to each catch record.
- Input: catch record, compliance rules, quota state, zone configuration, season data.
- Processing: The system shall evaluate the record and assign a status such as valid, flagged, incomplete, under review, rejected, or approved.
- Expected Output: catch status, validation result, warnings, and compliance flags.
- Preconditions: catch data is submitted and rules are configured.
- Postconditions: the catch is either accepted for operational use or flagged for review or rejection.

#### FR-CATCH-03

- Requirement ID: FR-CATCH-03
- Requirement: Catch Data Fields
- Priority: High
- Description: The system shall record the minimum mandatory catch metadata required for compliance and traceability.
- Input: species, quantity, date/time, GPS, zone, optional photo, catch batch ID, validation status.
- Processing: The system shall persist and manage catch data with required validation rules.
- Expected Output: complete catch record with associated metadata.
- Preconditions: user has authority to submit catch records.
- Postconditions: catch information can be used for quota, trust, traceability, and reporting functions.

### 4.3.3 Quota Management

#### FR-QUOTA-01

- Requirement ID: FR-QUOTA-01
- Requirement: Quota Management
- Priority: High
- Description: The system shall manage fisher quotas, species quota limits, and seasonal quotas, and it shall calculate remaining and used quota values.
- Input: fisher quota, species quota, seasonal quota, used quota, remaining quota.
- Processing: The system shall calculate monetary or weight-based used and remaining quantities, compare them to configured limits, and determine compliance status.
- Expected Output: quota summary, utilization values, and warnings.
- Preconditions: quota records and catch metadata are available.
- Postconditions: quota utilization can be displayed to users and regulators.

#### FR-QUOTA-02

- Requirement ID: FR-QUOTA-02
- Requirement: Quota Warning Thresholds
- Priority: High
- Description: The system shall issue warnings when quota usage approaches or reaches critical thresholds.
- Input: current used quota and configured quota thresholds.
- Processing: The system shall evaluate whether usage has reached 80%, 100%, or exceeds the configured limit.
- Expected Output: quota alert, warning message, and operational recommendation.
- Preconditions: quota data exists and thresholds are configured.
- Postconditions: users are notified before or when quota limits are exceeded.

### 4.3.4 Zone and Compliance Management

#### FR-ZONE-01

- Requirement ID: FR-ZONE-01
- Requirement: Fishing Zone Management
- Priority: High
- Description: The system shall define and manage fishing zones and associate catch records with valid zone information.
- Input: zone ID, name, coordinates or boundaries, allowed species, seasonal status.
- Processing: The system shall validate each catch with reference to the configured zone metadata.
- Expected Output: zone association and compliance result.
- Preconditions: zone metadata is configured by administrator.
- Postconditions: catches are associated with valid, monitored fishing areas.

#### FR-COMPLIANCE-01

- Requirement ID: FR-COMPLIANCE-01
- Requirement: Restricted-Zone and Seasonal Compliance Checking
- Priority: High
- Description: The system shall detect violations related to restricted zones, seasonal restrictions, species restrictions, and fisher eligibility.
- Input: catch record, zone rules, seasonal schedule, species rules, licence status.
- Processing: The system shall compare the catch against the applicable compliance rules and generate a violation record where applicable.
- Expected Output: compliance result, reason, and violation record.
- Preconditions: catch data and compliance rules are available.
- Postconditions: violations are stored and visible to affected users and administrators.

### 4.3.5 Trust Engine

#### FR-TRUST-01

- Requirement ID: FR-TRUST-01
- Requirement: Explainable Catch Trust Engine
- Priority: High
- Description: The system shall compute a Trust Score from 0 to 100 for each catch batch using transparent, configurable rule-based checks. The score shall be accompanied by human-readable reasons and warnings.
- Input: catch details, licence data, quota state, zone compliance, seasonal compliance, metadata completeness.
- Processing: The system shall apply transparent validation rules such as licence validity, allowed zone, species validity, season status, quota availability, and record completeness. Each rule result is stored and used to calculate the final score.
- Expected Output: Trust Score, Trust Status, rule results, reasons, warnings, violation flags, review status.
- Preconditions: catch record exists and trust configuration has been defined.
- Postconditions: each catch batch has a transparent and auditable credibility assessment.

#### FR-TRUST-02

- Requirement ID: FR-TRUST-02
- Requirement: Trust Score Explanation
- Priority: High
- Description: The system shall explain why a catch received its Trust Score by exposing the rules that passed, failed, or were not applicable.
- Input: trust score result and underlying rule evaluations.
- Processing: The system shall generate human-readable explanations for each rule outcome and compile them into a traceable summary.
- Expected Output: readable rule-based explanation with warnings or review notes.
- Preconditions: trust evaluation has been completed.
- Postconditions: the score basis is understandable for buyers, regulators, and administrators.

### 4.3.6 Traceability and Marketplace

#### FR-TRACE-01

- Requirement ID: FR-TRACE-01
- Requirement: QR Traceability
- Priority: High
- Description: The system shall generate QR-linked records for catch batches and related sales to enable provenance tracking from source to sale.
- Input: catch record ID, sale context, associated order or listing data.
- Processing: The system shall create a QR code, link it to the originating catch or lot, and support retrieval of related provenance data.
- Expected Output: QR code generation and traceability lookup results.
- Preconditions: catch record exists and access is authorized.
- Postconditions: seafood provenance can be reviewed through a trusted chain from catch to sale.

#### FR-MARKET-01

- Requirement ID: FR-MARKET-01
- Requirement: Marketplace Listing
- Priority: High
- Description: The system shall provide a marketplace where fishers can list sea products and buyers can search or filter listings.
- Input: fisher listing details, species, quantity, price, catch metadata, trust and traceability information.
- Processing: The system shall store listing data, support filters and search, and display relevant catch and trust context.
- Expected Output: searchable marketplace listing and product overview.
- Preconditions: catch records are valid and listing permissions are appropriate.
- Postconditions: buyers can evaluate products and decide whether to place an order.

#### FR-ORDER-01

- Requirement ID: FR-ORDER-01
- Requirement: Order Placement and Management
- Priority: High
- Description: The system shall support order placement, review, confirmation, and status tracking between fishers and buyers.
- Input: buyer, selected listing, quantity, price, order notes.
- Processing: The system shall validate the request and create a formal order record tied to the specified catch or listing.
- Expected Output: order confirmation, order status, and linked transaction history.
- Preconditions: listing exists and both parties are authenticated.
- Postconditions: the transaction is recorded and traceable.

#### FR-ORDER-02

- Requirement ID: FR-ORDER-02
- Requirement: Price History
- Priority: Medium
- Description: The system shall maintain historical price data for seafood listings and sales to support transparent market comparison.
- Input: historical order records, market metadata, species and zone context.
- Processing: The system shall aggregate and store transaction prices over time for trend analysis.
- Expected Output: price history summaries and trend view.
- Preconditions: sales or listing records exist.
- Postconditions: historical market trends are available to users and administrators.

### 4.3.7 Analytics, Alerts, Reports, and Audit

#### FR-ANALYTICS-01

- Requirement ID: FR-ANALYTICS-01
- Requirement: Analytics Dashboard
- Priority: High
- Description: The system shall provide operational analytics summarizing catch volumes, quota use, species trends, and sustainability information.
- Input: catch records, quota records, compliance results, transaction records, selected time or zone filters.
- Processing: The system shall aggregate data by species, zone, time period, and operational dimension.
- Expected Output: charts, summaries, and dashboard insights.
- Preconditions: data exists in the database and filters are valid.
- Postconditions: decision makers can review trends and pressure indicators.

#### FR-PRESSURE-01

- Requirement ID: FR-PRESSURE-01
- Requirement: Resource Pressure Indicator
- Priority: High
- Description: The system shall calculate a Resource Pressure Indicator using zone, species, and time-based catch pressure, quota utilization, and configured sustainability thresholds.
- Input: zone, species, time period, catch pressure records, quota utilization values, sustainability thresholds.
- Processing: The system shall aggregate pressure data and compare it with operational thresholds to classify pressure level.
- Expected Output: Resource Pressure Indicator value and category.
- Preconditions: operational catch and quota data exist and thresholds are configured.
- Postconditions: administrators can review pressure conditions without treating the indicator as a biological stock measurement.

#### FR-ALERT-01

- Requirement ID: FR-ALERT-01
- Requirement: Weather and Compliance Alerts
- Priority: High
- Description: The system shall issue alerts for adverse weather, quota risk, and compliance-related triggers.
- Input: weather conditions, quota state, violation records, alert configuration.
- Processing: The system shall evaluate conditions against rule thresholds and notify the affected user or role.
- Expected Output: alert messages, notifications, and visual indicators.
- Preconditions: relevant data and notification channels are available.
- Postconditions: users receive timely operational warnings.

#### FR-REPORT-01

- Requirement ID: FR-REPORT-01
- Requirement: Reports and Export
- Priority: High
- Description: The system shall generate operational reports and support export in CSV and PDF formats.
- Input: report type, date range, filters, selected data set.
- Processing: The system shall build a report from stored records and export it in the requested format.
- Expected Output: downloadable or printable report in CSV and/or PDF format.
- Preconditions: relevant data exists and user has access to the report function.
- Postconditions: official or operational reports can be shared and archived.

#### FR-AUDIT-01

- Requirement ID: FR-AUDIT-01
- Requirement: Audit Logs
- Priority: High
- Description: The system shall keep a permanent and reviewable history of significant user and system actions.
- Input: event type, timestamp, user identity, affected records, action details.
- Processing: The system shall write a structured audit record whenever a relevant action or change occurs.
- Expected Output: audit log entries appropriate to the event and access scope.
- Preconditions: system event or state change occurs.
- Postconditions: activity remains traceable and reviewable for accountability.

#### FR-VIOLATION-01

- Requirement ID: FR-VIOLATION-01
- Requirement: Violation Tracking and Admin Review
- Priority: High
- Description: The system shall log violations, assign them to affected users or records, and support administrative review and resolution.
- Input: compliance violation, affected fisher or record, review action.
- Processing: The system shall store the violation details, maintain review status, and support resolution states.
- Expected Output: violation record, admin review outcome, and visibility to affected parties.
- Preconditions: compliance rule or policy is violated.
- Postconditions: corrective actions and accountability records are available for review.

---

# 5. NON-FUNCTIONAL REQUIREMENTS

## 5.1 Security
- The system shall use secure authentication and role-based access control.
- User passwords shall not be stored in plain text.
- Sensitive GPS and account information shall be protected from unauthorized access.
- All privileged operations shall be logged and auditable.
- The system shall support HTTPS-ready deployment architecture.

## 5.2 Performance
- The system shall support concurrent user access for operational and administrative functions.
- Dashboards and reporting views shall respond within practical limits for web-based use.
- Quota and compliance checks shall be executed quickly during catch submission.

## 5.3 Reliability
- The system shall preserve valid records even when an operation is partially failed.
- Critical catch and order records shall be stored in a consistent manner.
- The system shall recover gracefully from common user, network, and processing errors.

## 5.4 Usability
- The interface shall be usable for field operators and desktop users.
- Alerts and compliance statuses shall be clear and actionable.
- The system shall support English and Tamil interfaces.
- The fisher-facing interface shall be responsive and mobile-friendly.

## 5.5 Portability
- The system shall operate on modern web browsers and common device types.
- It shall support desktop and mobile access without requiring a native application.

## 5.6 Maintainability
- The system shall be modular and logically organized by functional domain.
- The design shall allow future extension without replacing core modules.
- Business rules shall be configurable where appropriate to support policy change.

## 5.7 Auditability
- The system shall record significant events and provide review access to authorized roles.
- Compliance decisions and approvals shall be traceable.
- Data changes affecting quotas, catch records, and trust evaluation shall be auditable.

---

# 6. SYSTEM BOUNDARIES AND CONSTRAINTS

TideLedger is an operational fisheries management platform that shall support the following major boundaries:
- user authentication and access control,
- fisher and buyer management,
- license validation,
- catch recording, review, and validation,
- quota and compliance management,
- trust evaluation,
- traceability and marketplace support,
- analytics and reporting,
- governance and administrative review.

The system shall be designed around the following constraints:
- no native application requirement as a core feature,
- no blockchain requirement,
- no generic AI replacement for the trust engine,
- no direct biological stock measurement function,
- no obligation for additional languages beyond English and Tamil,
- no requirement for IoT aquaculture monitoring within the initial scope.

---

# 7. OBJECTIVES AND GOALS

The primary objectives of TideLedger are to:
- digitize catch reporting,
- improve quota compliance,
- detect restricted-zone and seasonal violations,
- improve seafood traceability,
- increase buyer confidence,
- connect fishers directly with buyers,
- provide sustainability-oriented analytics,
- provide explainable catch credibility assessment,
- improve fisher safety through alerts,
- maintain auditable catch-to-sale records.

The system shall achieve these objectives by providing an integrated operational platform that records genuine fishery actions, validates them against policy, explains credibility, and preserves transparency across the value chain.

---

# 8. CONCLUSION

TideLedger shall be a complete, transparent, and auditable fisheries resource management platform that supports fishers, buyers, government stakeholders, and administrators through one integrated system. The platform shall be governed by clear operational requirements, rule-based trust assessment, compliance enforcement, traceability, and sustainability analytics.

This SRS defines the required behavior of the product in a formal, academic, and engineering-oriented structure. It emphasizes the operational, regulatory, and sustainability needs of the fisheries domain while preserving the approved project identity and the central innovation of the Explainable Rule-Based Trust Engine.

This document forms the specification baseline for TideLedger and should be used as the authoritative description of what the system must do.
